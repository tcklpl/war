import {
    Button,
    CircularProgress,
    Container,
    Grid2,
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
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ServerConnectionCandidate } from '../../../game/server/connection/server_connection_candidate';
import { useGame } from '../../../hooks/use_game';
import './server_select.scss';
import ServerSelectAddServerScreen from './server_select_add_server';
import ServerSelectConnectionInfo from './server_select_connection_info';
import ServerSelectPasswordPrompt from './server_select_password_prompt';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HttpsIcon from '@mui/icons-material/Https';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import { UsernameNotAvailableError } from '../../../errors/game/connection/username_not_available';
import { WrongPasswordError } from '../../../errors/game/connection/wrong_password';
import { useGameSession } from '../../../hooks/use_game_session';
import { ServerListEntry } from './server_list_entry';

const ServerSelectScreen: React.FC = () => {
    const { palette } = useTheme();
    const { t } = useTranslation(['server_list', 'common']);
    const { gameInstance } = useGame();
    const { username, saveGameSession } = useGameSession();
    const navigate = useNavigate();

    const [servers, setServers] = useState<ServerListEntry[]>([]);
    const [selectedServer, setSelectedServer] = useState<ServerListEntry | undefined>(undefined);
    const [serverBeingEdited, setServerBeingEdited] = useState<ServerListEntry | undefined>(undefined);

    /*
        Fetches all saved servers from the local server storage.
    */
    const updateServerList = useCallback(() => {
        gameInstance?.runWhenReady(async () => {
            const servers = await gameInstance.state.serverList.getAllServers();
            setServers(
                servers.map(sv => {
                    return {
                        info: sv,
                        connectionCandidate: new ServerConnectionCandidate(sv.address),
                    } as ServerListEntry;
                }),
            );
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
                if (sv.connectionCandidate.status === 'loading') {
                    await sv.connectionCandidate.ping();
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
            if (!selectedServer?.connectionCandidate.serverInfo) return;

            setServerConMessage(t('server_list:connecting'));

            try {
                const connection = await selectedServer.connectionCandidate.login(username, password);
                if (!connection) {
                    // TODO: Error alert
                    return;
                }
                gameInstance?.state.setActiveServerConnection(connection);
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
        [selectedServer, t, username, saveGameSession, navigate, gameInstance?.state],
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

        selectedServer.connectionCandidate.cancelPing();
        await selectedServer.connectionCandidate.ping();

        // server still didn't respond
        if (selectedServer.connectionCandidate.status !== 'ready' || !selectedServer.connectionCandidate.serverInfo) {
            setServerConTitle(`${t('server_list:failed_to_connect')}: ${t('server_list:error_failed_to_fetch_data')}`);
            setServerConMessage(t('server_list:error_failed_to_fetch_data_desc'));
            setServerConCloseable(true);
            return;
        }

        if (selectedServer.connectionCandidate.serverInfo.hasPassword) {
            setPassPromptOpen(true);
        } else {
            await connectToServer();
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
            <Grid2
                container
                className='server-select-screen'
                style={{ backgroundColor: palette.background.default }}
                justifyContent='center'
                alignContent='center'
            >
                <Stack spacing={5} width='100%'>
                    <Grid2>
                        <Typography variant='h4'>
                            <PublicIcon style={{ marginRight: '0.5em', fontSize: '1em', verticalAlign: 'middle' }} />
                            {t('server_list:server_list')}
                        </Typography>
                        <Typography variant='caption'>{`${t('common:playing_as')} ${username}`}</Typography>
                    </Grid2>

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
                                    .sort((a, b) => a.info.listPosition - b.info.listPosition)
                                    .map(sv => (
                                        <TableRow
                                            key={sv.info.id}
                                            onClick={() => setSelectedServer(sv)}
                                            selected={selectedServer === sv}
                                            onDoubleClick={() => startConnectionAttempt()}
                                        >
                                            <TableCell>
                                                <Stack spacing={3}>
                                                    <Typography>
                                                        {sv.connectionCandidate.status === 'ready'
                                                            ? `${sv.connectionCandidate.serverInfo?.name} (${sv.info.localName})`
                                                            : sv.info.localName}
                                                    </Typography>
                                                    <Typography
                                                        color={
                                                            sv.connectionCandidate.status === 'error'
                                                                ? palette.error.main
                                                                : palette.primary.main
                                                        }
                                                    >
                                                        {(() => {
                                                            switch (sv.connectionCandidate.status) {
                                                                case 'ready':
                                                                    return sv.connectionCandidate.serverInfo
                                                                        ?.description;
                                                                case 'error':
                                                                    return (
                                                                        <>
                                                                            <CloseIcon
                                                                                style={{ verticalAlign: 'middle' }}
                                                                            />
                                                                            {t('server_list:failed_to_connect')}
                                                                        </>
                                                                    );
                                                                default:
                                                                    return (
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
                                                                    );
                                                            }
                                                        })()}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {sv.connectionCandidate.status === 'ready' &&
                                                    (sv.connectionCandidate.serverInfo?.hasPassword ? (
                                                        <Tooltip title={t('server_list:requires_password')}>
                                                            <HttpsIcon style={{ verticalAlign: 'middle' }} />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title={t('server_list:no_password')}>
                                                            <NoEncryptionIcon style={{ verticalAlign: 'middle' }} />
                                                        </Tooltip>
                                                    ))}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {sv.connectionCandidate.status === 'ready' && (
                                                    <>
                                                        <PeopleIcon
                                                            style={{ verticalAlign: 'middle', marginRight: '0.5em' }}
                                                        />
                                                        {sv.connectionCandidate.serverInfo?.playerCount} /{' '}
                                                        {sv.connectionCandidate.serverInfo?.playerLimit}
                                                    </>
                                                )}
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
                                                        sv.connectionCandidate.cancelPing();
                                                        await gameInstance?.state.serverList.deleteServer(sv.info.id);
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
            </Grid2>
        </Container>
    );
};

export default ServerSelectScreen;
