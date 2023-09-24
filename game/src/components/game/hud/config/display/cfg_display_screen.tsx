import React, { useLayoutEffect, useState } from "react"
import { Grid, MenuItem, Select, Stack, Switch, Table, TableBody, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CfgTooltip from "../tooltip/cfg_tooltip";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useConfig } from "../../../../../hooks/use_config";

const CfgDisplayScreen: React.FC = () => {

    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{title: string, content: string} | undefined>();
    const { t } = useTranslation(["config"]);
    const { displayConfig, setDisplayConfig } = useConfig();

    const [theme, setTheme] = useState(displayConfig.theme);
    const [showPerformance, setShowPerformance] = useState(displayConfig.showPerformance);

    // useLayoutEffect instead of useEffect to run this before unmounting the parent cfg_screen
    useLayoutEffect(() => {
        // save the config when this screen is closed
        return () => {
            displayConfig.theme = theme;
            displayConfig.showPerformance = showPerformance;
            setDisplayConfig(displayConfig);
        }
    }, [showPerformance, theme, displayConfig, setDisplayConfig]);
    
    return (
        <Grid container style={{ backgroundColor: palette.background.default }} className="cfg-display-screen">

            <Grid item xs={8}>

                <Typography variant="h5">{ t("config:visual") }</Typography>
                <Table>
                    <TableBody>
                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:visual_theme"), content: t("config:visual_theme_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:visual_theme") }</Typography></TableCell>
                            <TableCell align="right">
                                <Select value={theme} onChange={e => {
                                    setTheme(e.target.value as string);
                                }}>

                                    <MenuItem value={'dark'}>
                                        <Stack direction={'row'}>
                                            <DarkModeIcon style={{marginRight: '0.5em'}}/> 
                                            { t("config:visual_theme_dark") }
                                        </Stack>
                                    </MenuItem>

                                    <MenuItem value={'light'}>
                                        <Stack direction={'row'}>
                                            <LightModeIcon style={{marginRight: '0.5em'}}/> 
                                            { t("config:visual_theme_light") }
                                        </Stack>
                                    </MenuItem>
                                </Select>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="h5" style={{marginTop: '1em'}}>{ t("config:display_performance") }</Typography>
                <Table>
                    <TableBody>
                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:display_performance_show_stats"), content: t("config:display_performance_show_stats_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:display_performance_show_stats") }</Typography></TableCell>
                            <TableCell align="right">
                                <Switch checked={showPerformance} onChange={e => {
                                    setShowPerformance(e.target.checked);
                                }}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                
            </Grid>

            <Grid item xs={4}>
                <CfgTooltip currentTooltip={currentTooltip}/>
            </Grid>

        </Grid>
    );
}

export default CfgDisplayScreen;