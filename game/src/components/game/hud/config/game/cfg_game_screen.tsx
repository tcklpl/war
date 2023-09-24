import React, { useEffect, useLayoutEffect, useState } from "react"
import { Grid, Switch, Table, TableBody, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CfgTooltip from "../tooltip/cfg_tooltip";
import { useConfig } from "../../../../../hooks/use_config";

const CfgGameScreen: React.FC = () => {

    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{title: string, content: string} | undefined>();
    const { t } = useTranslation(["config"]);
    const { gameConfig, setGameConfig } = useConfig();

    const [usedStorage, setUsedStorage] = useState(-1);
    const [cacheAssets, setCacheAssets] = useState(gameConfig.cacheAssets);

    useEffect(() => {
        const fetchUsage = async () => {
            const usage = await navigator.storage.estimate();
            setUsedStorage(usage.usage ?? -1);
        }
        fetchUsage();
    }, []);

    // useLayoutEffect instead of useEffect to run this before unmounting the parent cfg_screen
    useLayoutEffect(() => {
        // save the config when this screen is closed
        return () => {
            gameConfig.cacheAssets = cacheAssets;
            setGameConfig(gameConfig);
        }
    }, [cacheAssets, gameConfig, setGameConfig]);

    const convertBytesToName = (bytes: number) => {
        const units = ['bytes', 'KiB', 'MiB', 'GiB'];
        let b = bytes;
        let unitIndex = 0;
        while (b >= 1024) {
            b /= 1024;
            unitIndex++;
        }
        return `${b.toFixed(b < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
    }
    
    return (
        <Grid container style={{ backgroundColor: palette.background.default }} className="cfg-display-screen">

            <Grid item xs={8}>

                <Typography variant="h5">{ t("config:game_loading") }</Typography>
                <Table>
                    <TableBody>
                        <TableRow 
                            onMouseEnter={() => setCurrentTooltip({ 
                                title: t("config:game_loading_cache_assets"), 
                                content: t("config:game_loading_cache_assets_desc").replace('<USAGE>', usedStorage !== -1 ? `${convertBytesToName(usedStorage)}` : t("config:game_loading_cache_assets_desc_failed_to_calculate_usage"))
                            })}
                            onMouseLeave={() => setCurrentTooltip(undefined)}
                        >
                            <TableCell><Typography variant="body1">{ t("config:game_loading_cache_assets") }</Typography></TableCell>
                            <TableCell align="right">
                                <Switch checked={cacheAssets} onChange={e => {
                                    setCacheAssets(e.target.checked);
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

export default CfgGameScreen;