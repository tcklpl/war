import { useGameSession } from ':hooks/use_game_session';
import AnarchismIcon from ':icons/anarchism/anarchism_icon';
import CapitalismIcon from ':icons/capitalism/capitalism_icon';
import FeudalismIcon from ':icons/feudalism/feudalism_icon';
import SocialismIcon from ':icons/socialism/socialism_icon';
import { GameParty } from ':protocol';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { FunctionComponent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface HUDCommonPlayOrderProps {}

const HUDCommonPlayOrder: FunctionComponent<HUDCommonPlayOrderProps> = () => {
    const { currentGameSession, gTurnPlayerIndex } = useGameSession();
    const { t } = useTranslation(['parties', 'ingame']);

    const partyDecoratorMap = new Map<GameParty, { name: string; icon: ReactElement }>([
        ['anarchism', { name: t('parties:anarchism'), icon: <AnarchismIcon /> }],
        ['feudalism', { name: t('parties:feudalism'), icon: <FeudalismIcon /> }],
        ['socialism', { name: t('parties:socialism'), icon: <SocialismIcon /> }],
        ['capitalism', { name: t('parties:capitalism'), icon: <CapitalismIcon /> }],
    ]);

    if (!currentGameSession) return <></>;
    return (
        <Box width='100%' height='100%' display='flex' flexDirection='column' bgcolor='background.paper'>
            <Typography color='primary' textAlign='center'>
                {t('ingame:turn')}: {1}
            </Typography>
            <Tabs value={gTurnPlayerIndex} orientation='vertical'>
                {currentGameSession.initialGameState.players.map(p => (
                    <Tab label={p.name} icon={partyDecoratorMap.get(p.party)?.icon} iconPosition='top' key={p.party} />
                ))}
            </Tabs>
        </Box>
    );
};

export default HUDCommonPlayOrder;
