import React, { useState } from "react"
import { Grid, Switch, Table, TableBody, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CfgTooltip from "../tooltip/cfg_tooltip";

const CfgGraphicsScreen: React.FC = () => {

    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{title: string, content: string} | undefined>();
    const { t } = useTranslation(["config"]);
    
    return (
        <Grid container style={{ backgroundColor: palette.background.default }} className="cfg-display-screen">

            <Grid item xs={8}>
                <Typography variant="h5">{ t("config:graphics_post_effects") }</Typography>
                <Table>
                    <TableBody>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_ssao"), content: t("config:graphics_post_effects_ssao_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_ssao") }</Typography></TableCell>
                            <TableCell align="right"><Switch/></TableCell>
                        </TableRow>

                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ title: t("config:graphics_post_effects_bloom"), content: t("config:graphics_post_effects_bloom_desc")})}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:graphics_post_effects_bloom") }</Typography></TableCell>
                            <TableCell align="right"><Switch/></TableCell>
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