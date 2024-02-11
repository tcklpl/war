import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Tab } from "@mui/material";
import React, { useState } from "react"
import LobbyAdminConfigScreenGlobal from "./config_pages/lobby_admin_cfg_global";
import LobbyAdminConfigScreenAnarchism from "./config_pages/lobby_admin_cfg_anarchism";
import LobbyAdminConfigScreenFeudalism from "./config_pages/lobby_admin_cfg_feudalism";
import LobbyAdminConfigScreenSocialism from "./config_pages/lobby_admin_cfg_socialism";
import LobbyAdminConfigScreenCapitalism from "./config_pages/lobby_admin_cfg_capitalism";


const LobbyAdminConfigScreen: React.FC = () => {

    const [cfgPage, setCfgPage] = useState("global");

    return (
        <Box sx={{ bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
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
                    <TabPanel value="global"><LobbyAdminConfigScreenGlobal/></TabPanel>
                    <TabPanel value="anarchism"><LobbyAdminConfigScreenAnarchism/></TabPanel>
                    <TabPanel value="feudalism"><LobbyAdminConfigScreenFeudalism/></TabPanel>
                    <TabPanel value="socialism"><LobbyAdminConfigScreenSocialism/></TabPanel>
                    <TabPanel value="capitalism"><LobbyAdminConfigScreenCapitalism/></TabPanel>
                </Box>
            </TabContext>
        </Box>
    );
}

export default LobbyAdminConfigScreen;