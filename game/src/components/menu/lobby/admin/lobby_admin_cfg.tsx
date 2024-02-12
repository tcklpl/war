import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Alert, Box, Tab } from "@mui/material";
import { useState } from "react"
import LobbyAdminConfigScreenGlobal from "./config_pages/lobby_admin_cfg_global";
import LobbyAdminConfigScreenAnarchism from "./config_pages/lobby_admin_cfg_anarchism";
import LobbyAdminConfigScreenFeudalism from "./config_pages/lobby_admin_cfg_feudalism";
import LobbyAdminConfigScreenSocialism from "./config_pages/lobby_admin_cfg_socialism";
import LobbyAdminConfigScreenCapitalism from "./config_pages/lobby_admin_cfg_capitalism";
import { useGameSession } from "../../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";


const LobbyAdminConfigScreen = () => {

    const { currentLobbyState } = useGameSession();
    const { t } = useTranslation(["lobby"]);

    const [cfgPage, setCfgPage] = useState("global");
    const isLobbyConfigReadonly = currentLobbyState?.game_config.is_immutable ?? false;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
            { currentLobbyState?.game_config.is_immutable && <Alert severity="info" sx={{ marginBottom: '1em'}}>{ t("lobby:cfg_immutable") }</Alert>}
            <Box sx={{ bgcolor: 'background.paper', display: 'flex', flexGrow: 1, minHeight: 0 }}>
                <TabContext value={cfgPage}>
                    <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                        <TabList onChange={(_, val) => setCfgPage(val)} orientation="vertical">
                            <Tab label="Global" value="global" />
                            <Tab label="Anarchism" value="anarchism" />
                            <Tab label="Feudalism" value="feudalism" />
                            <Tab label="Socialism" value="socialism" />
                            <Tab label="Capitalism" value="capitalism" />
                        </TabList>
                    </Box>
                    <Box overflow="auto" sx={{ flexGrow: 1 }} height="100%">
                        <TabPanel value="global"><LobbyAdminConfigScreenGlobal disabled={isLobbyConfigReadonly}/></TabPanel>
                        <TabPanel value="anarchism"><LobbyAdminConfigScreenAnarchism disabled={isLobbyConfigReadonly}/></TabPanel>
                        <TabPanel value="feudalism"><LobbyAdminConfigScreenFeudalism disabled={isLobbyConfigReadonly}/></TabPanel>
                        <TabPanel value="socialism"><LobbyAdminConfigScreenSocialism disabled={isLobbyConfigReadonly}/></TabPanel>
                        <TabPanel value="capitalism"><LobbyAdminConfigScreenCapitalism disabled={isLobbyConfigReadonly}/></TabPanel>
                    </Box>
                </TabContext>
            </Box>
        </Box>
    );
}

export default LobbyAdminConfigScreen;