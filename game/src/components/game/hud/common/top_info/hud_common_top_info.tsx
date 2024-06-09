import { Box, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameSession } from '../../../../../hooks/use_game_session';

interface HUDCommonTopInfoProps {}

const HUDCommonTopInfo: FunctionComponent<HUDCommonTopInfoProps> = () => {
    const { username, currentLobbyState } = useGameSession();
    const { t } = useTranslation(['common']);

    if (!currentLobbyState) return <></>;
    return (
        <Box width='100%' height='100%' display='flex' flexDirection='column' bgcolor='background.paper'>
            <Box display='flex' width='100%' height='100%' justifyContent='space-between'>
                <Box display='flex' alignItems='center' marginLeft='1em' width='25%'>
                    <Typography color='GrayText'>
                        {t('common:playing_as')} {username} @ {currentLobbyState.name}
                    </Typography>
                </Box>

                <Box width='25%' marginRight='1em' textAlign='right'></Box>
            </Box>
        </Box>
    );
};

export default HUDCommonTopInfo;
