import { useConfig } from ':hooks/use_config';
import {
    Box,
    Grid2,
    Grow,
    MenuItem,
    Select,
    Slider,
    Switch,
    Table,
    TableBody,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigLabel from '../config_label/config_label';
import CfgTooltip from '../tooltip/cfg_tooltip';

const CfgGraphicsScreen: React.FC = () => {
    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{ title: string; content: string } | undefined>();
    const { t } = useTranslation(['config']);
    const { graphicsConfig } = useConfig();

    const [shadowQuality, setShadowQuality] = useState(graphicsConfig.shadowMapQuality);
    const [shadowFilteringQuality, setShadowFilteringQuality] = useState(graphicsConfig.shadowFiltering);
    const [shaderQuality, setShaderQuality] = useState(graphicsConfig.shaderQuality);

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
            graphicsConfig.shadowFiltering = shadowFilteringQuality;
            graphicsConfig.shaderQuality = shaderQuality;

            graphicsConfig.useSSAO = useSSAO;
            graphicsConfig.useBloom = useBloom;
            graphicsConfig.useTAA = useTAA;
            graphicsConfig.motionBlurAmount = motionBlurAmount;
            graphicsConfig.useFilmGrain = useFilmGrain;
        };
    }, [
        shadowQuality,
        shadowFilteringQuality,
        shaderQuality,
        useSSAO,
        useBloom,
        useTAA,
        motionBlurAmount,
        useFilmGrain,
        graphicsConfig,
    ]);

    useEffect(() => {
        if (shadowQuality > 0) return;
        setShadowFilteringQuality(0);
    }, [shadowQuality]);

    return (
        <Grid2 container style={{ backgroundColor: palette.background.default }} className='cfg-display-screen'>
            <Grid2 size={{ xs: 8 }}>
                <Grow in timeout={100}>
                    <Typography variant='h5'>{t('config:graphics_rendering')}</Typography>
                </Grow>
                <Table>
                    <TableBody>
                        {/* Shadows */}
                        <ConfigLabel
                            title={t('config:graphics_rendering_shadows')}
                            description={t('config:graphics_rendering_shadows_desc')}
                            animationDelay={200}
                            setTooltip={setCurrentTooltip}
                        >
                            <Select
                                value={shadowQuality}
                                onChange={e => {
                                    setShadowQuality(e.target.value as number);
                                }}
                            >
                                <MenuItem value={0}>{t('config:generic_off')}</MenuItem>
                                <MenuItem value={1}>{t('config:generic_very_low')}</MenuItem>
                                <MenuItem value={2}>{t('config:generic_low')}</MenuItem>
                                <MenuItem value={3}>{t('config:generic_medium')}</MenuItem>
                                <MenuItem value={4}>{t('config:generic_high')}</MenuItem>
                            </Select>
                        </ConfigLabel>

                        {/* Shadow filtering */}
                        <ConfigLabel
                            title={t('config:graphics_rendering_shadow_filtering')}
                            description={t('config:graphics_rendering_shadow_filtering_desc')}
                            animationDelay={300}
                            setTooltip={setCurrentTooltip}
                        >
                            <Select
                                value={shadowFilteringQuality}
                                disabled={!shadowQuality}
                                onChange={e => {
                                    setShadowFilteringQuality(e.target.value as number);
                                }}
                            >
                                <MenuItem value={0}>{t('config:generic_off')}</MenuItem>
                                <MenuItem value={1}>{t('config:generic_low')}</MenuItem>
                                <MenuItem value={2}>{t('config:generic_medium')}</MenuItem>
                            </Select>
                        </ConfigLabel>

                        {/* Shader quality */}
                        <ConfigLabel
                            title={t('config:graphics_rendering_shaders')}
                            description={t('config:graphics_rendering_shaders_desc')}
                            animationDelay={400}
                            setTooltip={setCurrentTooltip}
                        >
                            <Select
                                value={shaderQuality}
                                onChange={e => {
                                    setShaderQuality(e.target.value as number);
                                }}
                            >
                                <MenuItem value={1}>{t('config:generic_low')}</MenuItem>
                                <MenuItem value={2}>{t('config:generic_medium')}</MenuItem>
                            </Select>
                        </ConfigLabel>
                    </TableBody>
                </Table>

                <Grow in timeout={500}>
                    <Typography variant='h5' style={{ marginTop: '1em' }}>
                        {t('config:graphics_post_effects')}
                    </Typography>
                </Grow>
                <Table>
                    <TableBody>
                        {/* SSAO */}
                        <ConfigLabel
                            title={t('config:graphics_post_effects_ssao')}
                            description={t('config:graphics_post_effects_ssao_desc')}
                            animationDelay={600}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={useSSAO}
                                onChange={e => {
                                    setUseSSAO(e.target.checked);
                                }}
                            />
                        </ConfigLabel>

                        {/* Bloom */}
                        <ConfigLabel
                            title={t('config:graphics_post_effects_bloom')}
                            description={t('config:graphics_post_effects_bloom_desc')}
                            animationDelay={700}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={useBloom}
                                onChange={e => {
                                    setUseBloom(e.target.checked);
                                }}
                            />
                        </ConfigLabel>

                        {/* TAA */}
                        <ConfigLabel
                            title={t('config:graphics_post_effects_taa')}
                            description={t('config:graphics_post_effects_taa_desc')}
                            animationDelay={800}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={useTAA}
                                onChange={e => {
                                    setUseTAA(e.target.checked);
                                }}
                            />
                        </ConfigLabel>

                        {/* Motion blur */}
                        <ConfigLabel
                            title={t('config:graphics_post_effects_motion_blur')}
                            description={t('config:graphics_post_effects_motion_blur_desc')}
                            animationDelay={900}
                            setTooltip={setCurrentTooltip}
                        >
                            <Box display={'flex'}>
                                <Box flexGrow={1}>
                                    <Slider
                                        size='small'
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={motionBlurAmount}
                                        onChange={(e, val) => {
                                            setMotionBlurAmount(val as number);
                                        }}
                                    />
                                </Box>
                                <Box paddingLeft={1}>
                                    <Typography variant='body1' width='4em'>
                                        {(motionBlurAmount * 100).toFixed(0)}%
                                    </Typography>
                                </Box>
                            </Box>
                        </ConfigLabel>

                        {/* Film grain */}
                        <ConfigLabel
                            title={t('config:graphics_post_effects_film_grain')}
                            description={t('config:graphics_post_effects_film_grain_desc')}
                            animationDelay={1000}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={useFilmGrain}
                                onChange={e => {
                                    setUseFilmGrain(e.target.checked);
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

export default CfgGraphicsScreen;
