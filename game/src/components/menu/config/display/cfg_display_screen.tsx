import { useConfig } from ':hooks/use_config';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Grid2, Grow, MenuItem, Select, Stack, Switch, Table, TableBody, Typography, useTheme } from '@mui/material';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigLabel from '../config_label/config_label';
import CfgTooltip from '../tooltip/cfg_tooltip';

const CfgDisplayScreen: React.FC = () => {
    const { palette } = useTheme();
    const [currentTooltip, setCurrentTooltip] = useState<{ title: string; content: string } | undefined>();
    const { t, i18n } = useTranslation(['config']);
    const { displayConfig, setDisplayConfig } = useConfig();

    const [theme, setTheme] = useState(displayConfig.theme);
    const [language, setLanguage] = useState(localStorage.getItem('language'));
    const [showPerformance, setShowPerformance] = useState(displayConfig.showPerformance);
    const [showPerformanceChart, setShowPerformanceChart] = useState(displayConfig.showPerformanceCharts);

    // useLayoutEffect instead of useEffect to run this before unmounting the parent cfg_screen
    useLayoutEffect(() => {
        // save the config when this screen is closed
        return () => {
            displayConfig.theme = theme;
            displayConfig.showPerformance = showPerformance;
            displayConfig.showPerformanceCharts = showPerformanceChart;
        };
    }, [showPerformance, showPerformanceChart, theme, displayConfig]);

    useEffect(() => {
        if (!showPerformance) setShowPerformanceChart(false);
    }, [showPerformance]);

    return (
        <Grid2 container style={{ backgroundColor: palette.background.default }} className='cfg-display-screen'>
            <Grid2 size={{ xs: 8 }}>
                <Grow in timeout={100}>
                    <Typography variant='h5'>{t('config:visual')}</Typography>
                </Grow>
                <Table>
                    <TableBody>
                        {/* Language */}
                        <ConfigLabel
                            animationDelay={200}
                            title={t('config:visual_language')}
                            description={t('config:visual_language_desc')}
                            setTooltip={setCurrentTooltip}
                        >
                            <Select
                                value={language}
                                onChange={e => {
                                    setLanguage(e.target.value);
                                    i18n.changeLanguage(e.target.value as string);
                                    localStorage.setItem('language', e.target.value as string);
                                }}
                            >
                                <MenuItem value={'en-US'}>{t('config:visual_language_en-US')}</MenuItem>
                            </Select>
                        </ConfigLabel>

                        {/* Theme */}
                        <ConfigLabel
                            animationDelay={200}
                            title={t('config:visual_theme')}
                            description={t('config:visual_theme_desc')}
                            setTooltip={setCurrentTooltip}
                        >
                            <Select
                                value={theme}
                                onChange={e => {
                                    // theme changes should be applied instantly
                                    setTheme(e.target.value);
                                    const newConfig = { ...displayConfig };
                                    newConfig.theme = e.target.value;
                                    setDisplayConfig(newConfig);
                                }}
                            >
                                <MenuItem value={'dark'}>
                                    <Stack direction={'row'}>
                                        <DarkModeIcon style={{ marginRight: '0.5em' }} />
                                        {t('config:visual_theme_dark')}
                                    </Stack>
                                </MenuItem>

                                <MenuItem value={'light'}>
                                    <Stack direction={'row'}>
                                        <LightModeIcon style={{ marginRight: '0.5em' }} />
                                        {t('config:visual_theme_light')}
                                    </Stack>
                                </MenuItem>
                            </Select>
                        </ConfigLabel>
                    </TableBody>
                </Table>

                <Grow in timeout={400}>
                    <Typography variant='h5' style={{ marginTop: '1em' }}>
                        {t('config:display_performance')}
                    </Typography>
                </Grow>
                <Table>
                    <TableBody>
                        {/* Show performance stats */}
                        <ConfigLabel
                            animationDelay={500}
                            title={t('config:display_performance_show_stats')}
                            description={t('config:display_performance_show_stats_desc')}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={showPerformance}
                                onChange={e => {
                                    setShowPerformance(e.target.checked);
                                }}
                            />
                        </ConfigLabel>

                        {/* Show performance graph */}
                        <ConfigLabel
                            animationDelay={600}
                            title={t('config:display_performance_show_stats_chart')}
                            description={t('config:display_performance_show_stats_chart_desc')}
                            setTooltip={setCurrentTooltip}
                        >
                            <Switch
                                checked={showPerformanceChart}
                                disabled={!showPerformance}
                                onChange={e => {
                                    setShowPerformanceChart(e.target.checked);
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

export default CfgDisplayScreen;
