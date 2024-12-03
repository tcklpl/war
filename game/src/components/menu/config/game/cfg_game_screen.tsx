import { useConfig } from ':hooks/use_config';
import { Grid2, Grow, Switch, Table, TableBody, Typography, useTheme } from '@mui/material';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigLabel from '../config_label/config_label';
import CfgTooltip from '../tooltip/cfg_tooltip';

const CfgGameScreen: React.FC = () => {
    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{ title: string; content: string } | undefined>();
    const { t } = useTranslation(['config']);
    const { gameConfig } = useConfig();

    const [usedStorage, setUsedStorage] = useState(-1);
    const [usedStorageAssetCount, setUsedStorageAssetCount] = useState(-1);

    const [cacheAssets, setCacheAssets] = useState(gameConfig.cacheAssets);

    useEffect(() => {
        const fetchUsage = async () => {
            const usage = await navigator.storage.estimate();
            setUsedStorage(usage.usage ?? -1);

            const assetNumber = await game.engine.managers.asset.getCachedAssetCount();
            setUsedStorageAssetCount(assetNumber ?? -1);
        };
        fetchUsage();
    }, []);

    // useLayoutEffect instead of useEffect to run this before unmounting the parent cfg_screen
    useLayoutEffect(() => {
        // save the config when this screen is closed
        return () => {
            gameConfig.cacheAssets = cacheAssets;
        };
    }, [cacheAssets, gameConfig]);

    const convertBytesToName = (bytes: number) => {
        const units = ['bytes', 'KiB', 'MiB', 'GiB'];
        let b = bytes;
        let unitIndex = 0;
        while (b >= 1024) {
            b /= 1024;
            unitIndex++;
        }
        return `${b.toFixed(b < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
    };

    const cacheAssetsDescription = t('config:game_loading_cache_assets_desc')
        .replace(
            '<USAGE>',
            usedStorage !== -1
                ? `${convertBytesToName(usedStorage)}`
                : t('config:game_loading_cache_assets_desc_failed_to_calculate_usage'),
        )
        .replace(
            '<ASSET_NO>',
            usedStorageAssetCount !== -1
                ? `${usedStorageAssetCount}`
                : t('config:game_loading_cache_assets_desc_failed_to_calculate_usage'),
        )
        .replace(
            '<ASSET_PLURAL>',
            usedStorageAssetCount > 1
                ? t('config:game_loading_cache_assets_desc_asset_plural')
                : t('config:game_loading_cache_assets_desc_asset_singular'),
        );

    return (
        <Grid2 container style={{ backgroundColor: palette.background.default }} className='cfg-display-screen'>
            <Grid2 size={{ xs: 8 }}>
                <Grow in timeout={100}>
                    <Typography variant='h5'>{t('config:game_loading')}</Typography>
                </Grow>
                <Table>
                    <TableBody>
                        <ConfigLabel
                            title={t('config:game_loading_cache_assets')}
                            description={cacheAssetsDescription}
                            animationDelay={200}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={cacheAssets}
                                onChange={e => {
                                    setCacheAssets(e.target.checked);
                                }}
                            />
                        </ConfigLabel>
                    </TableBody>
                </Table>
            </Grid2>

            <Grid2 size={{ xs: 4 }}>
                <CfgTooltip currentTooltip={currentTooltip} />
            </Grid2>
        </Grid2>
    );
};

export default CfgGameScreen;
