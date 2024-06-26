import {
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import './server_select.scss';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../../hooks/use_game';
import { ServerConnectionCandidate } from '../../../game/server/connection/server_connection_candidate';
import ServerSelectAddServerScreen from './server_select_add_server';
import { Link, useNavigate } from 'react-router-dom';
import ServerSelectPasswordPrompt from './server_select_password_prompt';
import ServerSelectConnectionInfo from './server_select_connection_info';

import HttpsIcon from '@mui/icons-material/Https';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublicIcon from '@mui/icons-material/Public';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGameSession } from '../../../hooks/use_game_session';
import { WrongPasswordError } from '../../../errors/game/connection/wrong_password';
import { UsernameNotAvailableError } from '../../../errors/game/connection/username_not_available';

const ServerSelectScreen: React.FC = () => {
    const { palette } = useTheme();
    const { t } = useTranslation(['server_list', 'common']);
    const { gameInstance } = useGame();
    const { username, setToken, saveGameSession } = useGameSession();
    const navigate = useNavigate();

    const [servers, setServers] = useState<ServerConnectionCandidate[]>([]);
    const [selectedServer, setSelectedServer] = useState<ServerConnectionCandidate | undefined>(undefined);
    const [serverBeingEdited, setServerBeingEdited] = useState<ServerConnectionCandidate | undefined>(undefined);

    /*
        Fetches all saved servers from the local server storage.
    */
    const updateServerList = useCallback(() => {
        gameInstance?.runWhenReady(async () => {
            const servers = await gameInstance.state.serverList.getAllServers();
            setServers(servers.map(sv => new ServerConnectionCandidate(sv)));
        });
    }, [gameInstance]);

    /*
        Clear stuff when component is unmounted.
        This is mostly for stuff to look right when hot-reloading.
    */
    useEffect(() => {
        return () => setSelectedServer(undefined);
    }, []);

    /*  
        Get all the servers as soon as a gameInstance is available.
        This will be the first effect to run when this page loads.
    */
    useEffect(() => {
        if (!gameInstance) {
            setServers([]);
            return;
        }
        updateServerList();
    }, [gameInstance, updateServerList]);

    /*
        Try to ping all the registered servers.
        This will happen as soon as the server list is retrieved.
    */
    useEffect(() => {
        servers.forEach(sv => {
            (async () => {
                if (sv.status === 'loading') {
                    await sv.ping();
                    setServers([...servers]);
                }
            })();
        });
    }, [servers]);

    /*
        Actually Connects to the server, this function is to be called when either:
        - The user tries to connect to a server without a password; or
        - The user enters the password for a server and presses connect.
    */
    const connectToServer = useCallback(
        async (password?: string) => {
            if (!selectedServer?.serverInfo) return;

            setServerConMessage(t('server_list:connecting'));

            try {
                const connection = await selectedServer.connect(username, password);
                gameInstance?.state.connectToServer(connection);
                setToken(connection.token);
                await saveGameSession();

                setServerConInfoOpen(false);
                navigate('/lobbies');
            } catch (e) {
                // Tried doing a map with messages, the linter ran out of memory
                if (e instanceof WrongPasswordError) {
                    setServerConTitle(t('server_list:error_wrong_password'));
                    setServerConMessage(t('server_list:error_wrong_password_desc'));
                } else if (e instanceof UsernameNotAvailableError) {
                    setServerConTitle(t('server_list:error_unavailable_username'));
                    setServerConMessage(t('server_list:error_unavailable_username_desc'));
                } else {
                    setServerConTitle(t('server_list:error_unknown'));
                    setServerConMessage(t('server_list:error_unknown_desc'));
                }

                setServerConCloseable(true);
            }
        },
        [selectedServer, t, username, setToken, saveGameSession, navigate, gameInstance?.state],
    );

    /*
        Starts trying to connect to the server, this is triggered wither with a double click on the server or by
        clicking the "connect" button.
    */
    const startConnectionAttempt = useCallback(async () => {
        if (!selectedServer) return;

        setServerConInfoOpen(true);
        setServerConCloseable(false);
        setServerConTitle(t('server_list:connecting'));
        setServerConMessage(t('server_list:connecting'));

        // if the user doesn't have the patience to wait for a ping
        if (selectedServer.status !== 'ready' || !selectedServer.serverInfo) {
            // the user will wait anyways, fuck you
            setServerConMessage(t('server_list:fetching_data'));
            selectedServer.cancelPing();
            await selectedServer.ping();

            // server still didn't respond
            if (selectedServer.status !== 'ready' || !selectedServer.serverInfo) {
                setServerConTitle(
                    `${t('server_list:failed_to_connect')}: ${t('server_list:error_failed_to_fetch_data')}`,
                );
                setServerConMessage(t('server_list:error_failed_to_fetch_data_desc'));
                setServerConCloseable(true);
                return;
            }
        }

        if (selectedServer.serverInfo.hasPassword) {
            setPassPromptOpen(true);
        } else {
            connectToServer();
        }
    }, [selectedServer, connectToServer, t]);

    const [addServerOpen, setAddServerOpen] = useState(false);
    const [passPromptOpen, setPassPromptOpen] = useState(false);

    const [serverConInfoOpen, setServerConInfoOpen] = useState(false);
    const [serverConTitle, setServerConTitle] = useState('');
    const [serverConMessage, setServerConMessage] = useState('');
    const [serverConCloseable, setServerConCloseable] = useState(false);

    return (
        <Container
            onClick={e => {
                if (e.target === e.currentTarget) setSelectedServer(undefined);
            }}
        >
            <Grid
                container
                className='server-select-screen'
                style={{ backgroundColor: palette.background.default }}
                justifyContent='center'
                alignContent='center'
            >
                <Stack spacing={5} width='100%'>
                    <Grid>
                        <Typography variant='h4'>
                            <PublicIcon style={{ marginRight: '0.5em', fontSize: '1em', verticalAlign: 'middle' }} />
                            {t('server_list:server_list')}
                        </Typography>
                        <Typography variant='caption'>{`${t('common:playing_as')} ${username}`}</Typography>
                    </Grid>

                    <ServerSelectConnectionInfo
                        open={serverConInfoOpen}
                        setOpen={setServerConInfoOpen}
                        server={selectedServer}
                        serverConMessage={serverConMessage}
                        closeable={serverConCloseable}
                        title={serverConTitle}
                    />

                    <ServerSelectAddServerScreen
                        open={addServerOpen}
                        setOpen={setAddServerOpen}
                        servers={servers}
                        setServers={setServers}
                        serverBeingEdited={serverBeingEdited}
                        setServerBeingEdited={setServerBeingEdited}
                    />

                    <ServerSelectPasswordPrompt
                        open={passPromptOpen}
                        setOpen={setPassPromptOpen}
                        onPasswordSet={connectToServer}
                    />

                    <TableContainer component={Paper} className='server-table'>
                        <Table>
                            <TableBody>
                                {servers
                                    .sort((a, b) => a.listInfo.listPosition - b.listInfo.listPosition)
                                    .map(sv => (
                                        <TableRow
                                            key={sv.listInfo.id}
                                            onClick={() => setSelectedServer(sv)}
                                            selected={selectedServer === sv}
                                            onDoubleClick={() => startConnectionAttempt()}
                                        >
                                            <TableCell>
                                                <Stack spacing={3}>
                                                    <Typography>
                                                        {sv.status === 'ready'
                                                            ? `${sv.serverInfo?.name} (${sv.listInfo.localName})`
                                                            : sv.listInfo.localName}
                                                    </Typography>
                                                    <Typography
                                                        color={
                                                            sv.status === 'error'
                                                                ? palette.error.main
                                                                : palette.primary.main
                                                        }
                                                    >
                                                        {sv.status === 'ready' ? (
                                                            sv.serverInfo?.description
                                                        ) : sv.status === 'error' ? (
                                                            <>
                                                                <CloseIcon style={{ verticalAlign: 'middle' }} />
                                                                {t('server_list:failed_to_connect')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CircularProgress
                                                                    size='1em'
                                                                    style={{
                                                                        verticalAlign: 'middle',
                                                                        marginRight: '0.5em',
                                                                    }}
                                                                />
                                                                {t('server_list:connecting')}
                                                            </>
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {sv.status === 'ready' ? (
                                                    sv.serverInfo?.hasPassword ? (
                                                        <Tooltip title={t('server_list:requires_password')}>
                                                            <HttpsIcon style={{ verticalAlign: 'middle' }} />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title={t('server_list:no_password')}>
                                                            <NoEncryptionIcon style={{ verticalAlign: 'middle' }} />
                                                        </Tooltip>
                                                    )
                                                ) : undefined}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {sv.status === 'ready' ? (
                                                    <>
                                                        <PeopleIcon
                                                            style={{ verticalAlign: 'middle', marginRight: '0.5em' }}
                                                        />
                                                        {sv.serverInfo?.playerCount} / {sv.serverInfo?.playerLimit}
                                                    </>
                                                ) : undefined}
                                            </TableCell>
                                            <TableCell align='right'>
                                                <Button
                                                    onClick={() => {
                                                        setServerBeingEdited(sv);
                                                        setAddServerOpen(true);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </Button>

                                                <Button
                                                    onClick={async () => {
                                                        sv.cancelPing();
                                                        await gameInstance?.state.serverList.deleteServer(
                                                            sv.listInfo.id,
                                                        );
                                                        if (selectedServer === sv) setSelectedServer(undefined);
                                                        updateServerList();
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Stack direction='row' className='server-select-buttons' justifyContent='space-around'>
                        <Link to='/'>
                            <Button variant='outlined' startIcon={<ArrowBackIcon />}>
                                {t('common:back_to_menu')}
                            </Button>
                        </Link>

                        <Button variant='outlined' onClick={() => updateServerList()} startIcon={<RefreshIcon />}>
                            {t('server_list:refresh')}
                        </Button>

                        <Button variant='outlined' onClick={() => setAddServerOpen(true)} startIcon={<AddIcon />}>
                            {t('server_list:add_server')}
                        </Button>

                        <Button
                            variant='outlined'
                            onClick={() => startConnectionAttempt()}
                            disabled={!selectedServer}
                            startIcon={<SendIcon />}
                        >
                            {t('server_list:connect')}
                        </Button>
                    </Stack>
                </Stack>
            </Grid>
        </Container>
    );
};

export default ServerSelectScreen;
