import { useConfig } from ':hooks/use_config';
import { useGame } from ':hooks/use_game';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MonitorIcon from '@mui/icons-material/Monitor';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Alert, Box, Stack, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CfgScreenDefaultBackground from '../default_background/cfg_default_background';
import CfgDisplayScreen from '../display/cfg_display_screen';
import CfgGameScreen from '../game/cfg_game_screen';
import CfgGraphicsScreen from '../graphics/cfg_graphics_screen';
import style from './cfg_screen.module.scss';

interface IPropsCfgScreen {
    showReturnToMenu?: boolean;
}

const CfgScreen: React.FC<IPropsCfgScreen> = ({ showReturnToMenu }) => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const [alignment, setAlignment] = React.useState('');
    const [currentConfigScreen, setCurrentConfigScreen] = useState<ReactNode>(<CfgScreenDefaultBackground />);
    const { t } = useTranslation(['config', 'common']);
    const { gameInstance } = useGame();
    const { saveConfig } = useConfig();

    useEffect(() => {
        // save config when the tab is closed
        return () => {
            saveConfig();
        };
    }, [saveConfig, setCurrentConfigScreen]);

    return (
        <Box
            style={{ backgroundColor: palette.background.default }}
            className={style.screen}
            sx={{ flexDirection: 'column', display: 'flex' }}
        >
            <Box className={style.header}>
                <Stack spacing={2} alignItems={'center'}>
                    <ToggleButtonGroup
                        color='primary'
                        exclusive
                        onChange={(e, alignment) => setAlignment(alignment)}
                        value={alignment}
                    >
                        {showReturnToMenu && (
                            <ToggleButton value={'menu'} onClick={() => navigate('/')}>
                                <ArrowBackIcon style={{ marginRight: '0.5em' }} /> {t('common:back_to_menu')}
                            </ToggleButton>
                        )}

                        <ToggleButton value={'display'} onClick={() => setCurrentConfigScreen(<CfgDisplayScreen />)}>
                            <MonitorIcon style={{ marginRight: '0.5em' }} /> {t('config:display')}
                        </ToggleButton>

                        <ToggleButton value={'graphics'} onClick={() => setCurrentConfigScreen(<CfgGraphicsScreen />)}>
                            <ViewInArIcon style={{ marginRight: '0.5em' }} /> {t('config:graphics')}
                        </ToggleButton>

                        <ToggleButton value={'game'} onClick={() => setCurrentConfigScreen(<CfgGameScreen />)}>
                            <SportsEsportsIcon style={{ marginRight: '0.5em' }} /> {t('config:game')}
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {!gameInstance?.engine.db.isAvailable ? (
                        <Alert severity='warning'>{t('config:no_idb')}</Alert>
                    ) : undefined}
                </Stack>
            </Box>

            <Box flexGrow={1}>{currentConfigScreen}</Box>
        </Box>
    );
};

export default CfgScreen;
