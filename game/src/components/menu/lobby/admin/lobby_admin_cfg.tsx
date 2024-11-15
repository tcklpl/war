import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Alert, Box, Tab } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameSession } from '../../../../hooks/use_game_session';
import '../lobby_screen.scss';
import LobbyAdminConfigScreenAnarchism from './config_pages/lobby_admin_cfg_anarchism';
import LobbyAdminConfigScreenCapitalism from './config_pages/lobby_admin_cfg_capitalism';
import LobbyAdminConfigScreenFeudalism from './config_pages/lobby_admin_cfg_feudalism';
import LobbyAdminConfigScreenGlobal from './config_pages/lobby_admin_cfg_global';
import LobbyAdminConfigScreenSocialism from './config_pages/lobby_admin_cfg_socialism';

import PublicIcon from '@mui/icons-material/Public';
import AnarchismIcon from ':icons/anarchism/anarchism_icon';
import CapitalismIcon from ':icons/capitalism/capitalism_icon';
import FeudalismIcon from ':icons/feudalism/feudalism_icon';
import SocialismIcon from ':icons/socialism/socialism_icon';

const LobbyAdminConfigScreen = () => {
    const { currentLobbyState } = useGameSession();
    const { t } = useTranslation(['lobby', 'parties']);

    const [cfgPage, setCfgPage] = useState('global');
    const isLobbyConfigReadonly = currentLobbyState?.game_config.is_immutable ?? false;

    return (
        <TabContext value={cfgPage}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {currentLobbyState?.game_config.is_immutable && (
                    <Alert severity='info' sx={{ marginBottom: '1em' }}>
                        {t('lobby:cfg_immutable')}
                    </Alert>
                )}
                <Box sx={{ bgcolor: 'background.paper', display: 'flex', flex: '1 1 auto' }}>
                    <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                        <TabList onChange={(_, val) => setCfgPage(val)} orientation='vertical'>
                            <Tab icon={<PublicIcon />} label='Global' value='global' />
                            <Tab icon={<AnarchismIcon />} label={t('parties:anarchism')} value='anarchism' />
                            <Tab icon={<FeudalismIcon />} label={t('parties:feudalism')} value='feudalism' />
                            <Tab icon={<SocialismIcon />} label={t('parties:socialism')} value='socialism' />
                            <Tab icon={<CapitalismIcon />} label={t('parties:capitalism')} value='capitalism' />
                        </TabList>
                    </Box>
                    <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                        <TabPanel value='global' className='lobby-growable-tab-panel'>
                            <LobbyAdminConfigScreenGlobal disabled={isLobbyConfigReadonly} />
                        </TabPanel>
                        <TabPanel value='anarchism' className='lobby-growable-tab-panel'>
                            <LobbyAdminConfigScreenAnarchism disabled={isLobbyConfigReadonly} />
                        </TabPanel>
                        <TabPanel value='feudalism' className='lobby-growable-tab-panel'>
                            <LobbyAdminConfigScreenFeudalism disabled={isLobbyConfigReadonly} />
                        </TabPanel>
                        <TabPanel value='socialism' className='lobby-growable-tab-panel'>
                            <LobbyAdminConfigScreenSocialism disabled={isLobbyConfigReadonly} />
                        </TabPanel>
                        <TabPanel value='capitalism' className='lobby-growable-tab-panel'>
                            <LobbyAdminConfigScreenCapitalism disabled={isLobbyConfigReadonly} />
                        </TabPanel>
                    </Box>
                </Box>
            </Box>
        </TabContext>
    );
};

export default LobbyAdminConfigScreen;
