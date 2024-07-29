import { Box, Button, ButtonGroup, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlayerNameBox from '../config/player_name_box/player_name_box';
import { useGameSession } from '../../../hooks/use_game_session';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../../hooks/use_game';
import { useAlert } from '../../../hooks/use_alert';

import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirmation } from '../../../hooks/use_confirmation';

const MainMenu: React.FC = () => {
    const { username, reconnectionInfo, setReconnectionInfo } = useGameSession();
    const { gameInstance } = useGame();
    const { enqueueAlert } = useAlert();
    const { enqueueConfirmation } = useConfirmation();
    const navigate = useNavigate();
    const { t } = useTranslation(['server_list', 'config', 'credits', 'common']);

    const [reconnecting, setReconnecting] = useState(false);

    const reconnectToLastSession = async () => {
        if (!gameInstance) return;
        if (!reconnectionInfo) return;
        setReconnecting(true);

        const success = await gameInstance.state.reconnectToServer(reconnectionInfo);
        if (!success) {
            setReconnecting(false);
            enqueueAlert({
                title: t('common:failed_to_rejoin'),
                content: t('common:error_failed_to_rejoin_socket'),
            });
        }

        gameInstance.state.server?.reconnectToGame(reconnectionInfo.sessionToken, result => {
            setReconnecting(false);
            if (result.result === 'error') {
                let reason = t('common:error_failed_to_rejoin_other');
                switch (result.reason) {
                    case 'invalid token':
                        reason = t('common:error_failed_to_rejoin_game_token_invalid');
                        break;
                    case 'game does not exist':
                        reason = t('common:error_failed_to_rejoin_game_doesnt_exist');
                        break;
                    case 'player wasnt in lobby':
                        reason = t('common:error_failed_to_rejoin_player_wasnt_on_lobby');
                        break;
                    case 'player still playing':
                        reason = t('common:error_failed_to_rejoin_still_playing');
                        break;
                    case 'game moved on':
                        reason = t('common:error_failed_to_rejoin_moved_on');
                        break;
                }
                navigate('/lobbies');
                enqueueAlert({
                    title: t('common:failed_to_rejoin'),
                    content: reason,
                });
            } else {
                navigate('/game');
            }
        });
    };

    const deleteLastSession = () => {
        enqueueConfirmation({
            title: t('common:delete_last_session'),
            description: t('common:delete_last_session_desc'),
            onConfirm() {
                setReconnectionInfo();
            },
        });
    };

    return (
        <Grid container style={{ height: '100vh' }} justifyContent='center' alignContent='center'>
            <Stack spacing={2}>
                <PlayerNameBox />
                {reconnectionInfo && (
                    <ButtonGroup variant='outlined' sx={{ display: 'flex' }} disabled={reconnecting}>
                        <Button
                            startIcon={reconnecting ? <CircularProgress size='1em' color='inherit' /> : <RestoreIcon />}
                            sx={{ flex: '1' }}
                            onClick={() => reconnectToLastSession()}
                        >
                            {t('common:reconnect')}
                        </Button>
                        <Button onClick={() => deleteLastSession()}>
                            <DeleteIcon />
                        </Button>
                    </ButtonGroup>
                )}
                <Button
                    variant='outlined'
                    startIcon={<PublicIcon />}
                    fullWidth={true}
                    disabled={!username}
                    onClick={() => navigate('/servers')}
                >
                    {t('server_list:server_list')}
                </Button>
                <Link to='/config'>
                    <Button variant='outlined' startIcon={<SettingsIcon />} fullWidth={true}>
                        {t('config:config')}
                    </Button>
                </Link>
                <Link to='/credits'>
                    <Button variant='outlined' startIcon={<MenuBookIcon />} fullWidth={true}>
                        {t('credits:credits')}
                    </Button>
                </Link>
            </Stack>
            <Box
                position={'fixed'}
                bottom={0}
                left={0}
                display={'flex'}
                margin={'1em 1em 1em 1em'}
                sx={{ pointerEvents: 'none' }}
            >
                <Typography variant='body2' color={'gray'}>
                    {process.env.REACT_APP_VERSION}
                </Typography>
            </Box>
        </Grid>
    );
};

export default MainMenu;
