import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { Alert, Box, Stack, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import MonitorIcon from '@mui/icons-material/Monitor';
import CfgDisplayScreen from "../config/display/cfg_display_screen";
import "./cfg_screen.sass";
import { useTranslation } from "react-i18next";
import CfgGraphicsScreen from "./graphics/cfg_graphics_screen";
import { useGame } from "../../../../hooks/use_game";
import CfgGameScreen from "./game/cfg_game_screen";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useConfig } from "../../../../hooks/use_config";

const CfgScreen: React.FC = () => {

    const { palette } = useTheme();
    const [alignment, setAlignment] = React.useState('');
    const [currentConfigScreen, setCurrentConfigScreen] = useState<ReactNode>();
    const { t } = useTranslation(["config"]);
    const { gameInstance } = useGame();
    const { saveConfig: save } = useConfig();

    const [updateConfig, setUpdateConfig] = useState(false);

    const notifyPageUpdate = useCallback((hasUpdated: boolean) => {
        setUpdateConfig(updateConfig || hasUpdated);
    }, [updateConfig, setUpdateConfig]);

    useEffect(() => {
        // save config when the tab is closed
        return () => {
            save();
        }
    }, [save]);
    
    return (
        <Box style={{ backgroundColor: palette.background.default }} className="cfg-screen" sx={{ flexDirection: 'column' }}>

            <Box className="cfg-screen-header">
                <Stack spacing={2}>
                    <ToggleButtonGroup color="primary" exclusive onChange={(e, alignment) => setAlignment(alignment)} value={alignment}>

                        <ToggleButton value={'display'} onClick={() => setCurrentConfigScreen(<CfgDisplayScreen/>)}>
                            <MonitorIcon style={{marginRight: '0.5em'}}/> { t("config:display") }
                        </ToggleButton>

                        <ToggleButton value={'graphics'} onClick={() => setCurrentConfigScreen(<CfgGraphicsScreen/>)}>
                            <ViewInArIcon style={{marginRight: '0.5em'}}/> { t("config:graphics") }
                        </ToggleButton>

                        <ToggleButton value={'game'} onClick={() => setCurrentConfigScreen(<CfgGameScreen/>)}>
                            <SportsEsportsIcon style={{marginRight: '0.5em'}}/> { t("config:game") }
                        </ToggleButton>

                    </ToggleButtonGroup>

                    {
                        !gameInstance?.engine.db.isAvailable ? (
                            <Alert severity="warning">{ t("config:no_idb") }</Alert>
                        ) : undefined
                    }
                </Stack>
            </Box>

            <Box flexGrow={1}>
                { currentConfigScreen }
            </Box>

        </Box>
    );
}

export default CfgScreen;