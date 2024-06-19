import { Box, Button, ButtonGroup, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
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

    const reconnectToLastSession = async () => {
        if (!reconnectionInfo) return;
        const success = await gameInstance?.state.reconnectToServer(reconnectionInfo);
        if (!success) {
            enqueueAlert({
                title: t('common:failed_to_rejoin'),
                content: t('common:error_failed_to_rejoin_socket'),
            });
        }
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
                    <ButtonGroup variant='outlined' sx={{ display: 'flex' }}>
                        <Button startIcon={<RestoreIcon />} sx={{ flex: '1' }} onClick={() => reconnectToLastSession()}>
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
