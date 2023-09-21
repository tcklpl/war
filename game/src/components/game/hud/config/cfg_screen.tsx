import React, { ReactNode, useState } from "react"
import { Box, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import MonitorIcon from '@mui/icons-material/Monitor';
import CfgDisplayScreen from "../config/display/cfg_display_screen";
import "./cfg_screen.sass";
import { useTranslation } from "react-i18next";
import CfgGraphicsScreen from "./graphics/cfg_graphics_screen";

const CfgScreen: React.FC = () => {

    const { palette } = useTheme();
    const [alignment, setAlignment] = React.useState('');
    const [currentConfigScreen, setCurrentConfigScreen] = useState<ReactNode>();
    const { t } = useTranslation(["config"]);

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlignment(newAlignment);
    };
    
    return (
        <Box style={{ backgroundColor: palette.background.default }} className="cfg-screen" sx={{ flexDirection: 'column' }}>

            <Box className="cfg-screen-header">
                <ToggleButtonGroup color="primary" exclusive onChange={handleChange} value={alignment}>

                    <ToggleButton value={'display'} onClick={() => setCurrentConfigScreen(<CfgDisplayScreen/>)}>
                        <MonitorIcon style={{marginRight: '0.5em'}}/> { t("config:display") }
                    </ToggleButton>
                    
                    <ToggleButton value={'graphics'} onClick={() => setCurrentConfigScreen(<CfgGraphicsScreen/>)}>
                        <ViewInArIcon style={{marginRight: '0.5em'}}/> { t("config:graphics") }
                    </ToggleButton>

                </ToggleButtonGroup>
            </Box>

            <Box flexGrow={1}>
                { currentConfigScreen }
            </Box>

        </Box>
    );
}

export default CfgScreen;