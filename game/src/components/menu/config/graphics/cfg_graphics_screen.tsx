import React, { useLayoutEffect, useState } from "react"
import { Grid, MenuItem, Select, Slider, Switch, Table, TableBody, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CfgTooltip from "../tooltip/cfg_tooltip";
import { useConfig } from "../../../../hooks/use_config";

const CfgGraphicsScreen: React.FC = () => {

    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{title: string, content: string} | undefined>();
    const { t } = useTranslation(["config"]);
    const { graphicsConfig } = useConfig();

    const [shadowQuality, setShadowQuality] = useState(graphicsConfig.shadowMapQuality);

    const [useSSAO, setUseSSAO] = useState(graphicsConfig.useSSAO);
    const [useBloom, setUseBloom] = useState(graphicsConfig.useBloom);
    const [useTAA, setUseTAA] = useState(graphicsConfig.useTAA);
    const [motionBlurAmount, setMotionBlurAmount] = useState(graphicsConfig.motionBlurAmount);
    const [useFilmGrain, setUseFilmGrain] = useState(graphicsConfig.useFilmGrain);

    // useLayoutEffect instead of useEffect to run this before unmounting the parent cfg_screen
    useLayoutEffect(() => {
        // save the config when this screen is closed
        return () => {
            graphicsConfig.shadowMapQuality = shadowQuality;

            graphicsConfig.useSSAO = useSSAO;
            graphicsConfig.useBloom = useBloom;
            graphicsConfig.useTAA = useTAA;
            graphicsConfig.motionBlurAmount = motionBlurAmount;
            graphicsConfig.useFilmGrain = useFilmGrain;
        }
    }, [shadowQuality, useSSAO, useBloom, useTAA, motionBlurAmount, useFilmGrain, graphicsConfig]);

    
    return (
        <Grid container style={{ backgroundColor: palette.background.default }} className="cfg-display-screen">

            <Grid item xs={8}>

                <Typography variant="h5">{ t("config:graphics_rendering") }</Typography>
                <Table>
                    <TableBody>
                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_rendering_shadows"), content: t("config:graphics_rendering_shadows_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_rendering_shadows") }</Typography></TableCell>
                            <TableCell align="right">
                                <Select value={shadowQuality} onChange={e => {
                                    setShadowQuality(e.target.value as number);
                                }}>
                                    <MenuItem value={0}>{t("config:generic_off")}</MenuItem>
                                    <MenuItem value={1}>{t("config:generic_very_low")}</MenuItem>
                                    <MenuItem value={2}>{t("config:generic_low")}</MenuItem>
                                    <MenuItem value={3}>{t("config:generic_medium")}</MenuItem>
                                    <MenuItem value={4}>{t("config:generic_high")}</MenuItem>
                                </Select>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="h5" style={{marginTop: '1em'}}>{ t("config:graphics_post_effects") }</Typography>
                <Table>
                    <TableBody>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_ssao"), content: t("config:graphics_post_effects_ssao_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_ssao") }</Typography></TableCell>
                            <TableCell align="right">
                                <Switch checked={useSSAO} onChange={e => {
                                    setUseSSAO(e.target.checked);
                                }}/>
                            </TableCell>
                        </TableRow>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_bloom"), content: t("config:graphics_post_effects_bloom_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_bloom") }</Typography></TableCell>
                            <TableCell align="right">
                                <Switch checked={useBloom} onChange={e => {
                                    setUseBloom(e.target.checked);
                                }}/>
                            </TableCell>
                        </TableRow>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_taa"), content: t("config:graphics_post_effects_taa_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_taa") }</Typography></TableCell>
                            <TableCell align="right">
                                <Switch checked={useTAA} onChange={e => {
                                    setUseTAA(e.target.checked);
                                }}/>
                            </TableCell>
                        </TableRow>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_motion_blur"), content: t("config:graphics_post_effects_motion_blur_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_motion_blur") }</Typography></TableCell>
                            <TableCell align="right">
                                <Grid container alignItems="center">
                                    <Grid item xs>
                                        <Slider size="small" min={0} max={1} step={0.01} value={motionBlurAmount} onChange={(e, val) => {
                                            setMotionBlurAmount(val as number);
                                        }}/>
                                    </Grid>
                                    <Grid item paddingLeft={1}>
                                        <Typography variant="body1" width="4em">{(motionBlurAmount * 100).toFixed(0)}%</Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_film_grain"), content: t("config:graphics_post_effects_film_grain_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_film_grain") }</Typography></TableCell>
                            <TableCell align="right">
                                <Switch checked={useFilmGrain} onChange={e => {
                                    setUseFilmGrain(e.target.checked);
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

export default CfgGraphicsScreen;