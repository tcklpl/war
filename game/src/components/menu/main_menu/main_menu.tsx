import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlayerNameBox from '../config/player_name_box/player_name_box';
import { useGameSession } from '../../../hooks/use_game_session';
import { useTranslation } from 'react-i18next';

import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const MainMenu: React.FC = () => {
    const { username } = useGameSession();
    const navigate = useNavigate();
    const { t } = useTranslation(['server_list', 'config', 'credits']);

    return (
        <Grid container style={{ height: '100vh' }} justifyContent='center' alignContent='center'>
            <Stack spacing={2}>
                <PlayerNameBox />
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
