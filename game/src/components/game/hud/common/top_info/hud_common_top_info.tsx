import { Box, Button, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameSession } from '../../../../../hooks/use_game_session';

import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SaveIcon from '@mui/icons-material/Save';

interface HUDCommonTopInfoProps {}

const HUDCommonTopInfo: FunctionComponent<HUDCommonTopInfoProps> = () => {
    const { username, currentLobbyState, currentGameSession } = useGameSession();
    const { t } = useTranslation(['common', 'ingame']);
    const isLobbyOwner =
        currentGameSession?.initialGameState.players.find(p => p.name === username)?.is_lobby_owner ?? false;

    const handlePauseGame = () => {
        currentGameSession?.pauseGame();
    };

    const handleSaveGame = () => {
        currentGameSession?.saveGame();
    };

    if (!currentLobbyState) return <></>;
    return (
        <Box width='100%' height='100%' display='flex' flexDirection='column' bgcolor='background.paper'>
            <Box display='flex' width='100%' height='100%' justifyContent='space-between'>
                <Box display='flex' alignItems='center' marginLeft='1em' width='25%'>
                    <Typography color='GrayText'>
                        {t('common:playing_as')} {username} @ {currentLobbyState.name}
                    </Typography>
                </Box>

                <Box width='25%' marginRight='1em' textAlign='right'>
                    {isLobbyOwner && (
                        <>
                            <Button
                                variant='outlined'
                                startIcon={<SaveIcon />}
                                onClick={handleSaveGame}
                                sx={{ pointerEvents: 'all' }}
                            >
                                {t('ingame:save')}
                            </Button>
                            <Button
                                variant='outlined'
                                startIcon={<HourglassEmptyIcon />}
                                onClick={handlePauseGame}
                                sx={{ pointerEvents: 'all' }}
                            >
                                {t('ingame:pause')}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default HUDCommonTopInfo;
