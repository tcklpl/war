import { Time } from ':engine/time';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import SixtyFpsSelectIcon from '@mui/icons-material/SixtyFpsSelect';
import { Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Line, LineChart, ReferenceLine, YAxis } from 'recharts';
import { useConfig } from '../../../../hooks/use_config';
import { useGame } from '../../../../hooks/use_game';
import { useGameSession } from '../../../../hooks/use_game_session';
import style from './debug_huds.module.scss';
import { HUDPerformanceColor } from './hud_performance_colors';

const HUDPerformance: React.FC = () => {
    const { gameInstance } = useGame();
    const { currentGameSession } = useGameSession();
    const { displayConfig: display } = useConfig();
    const { palette } = useTheme();

    const [fps, setFps] = useState(0);
    const [fpsColor, setFpsColor] = useState<string>(palette.text.primary);
    const [fpsHistory, setFpsHistory] = useState<number[]>(Array.apply(0, Array(60)).map(x => x) as number[]);

    const [ping, setPing] = useState(0);
    const [pingColor, setPingColor] = useState<string>(palette.text.primary);
    const [pingHistory, setPingHistory] = useState<number[]>(Array.apply(0, Array(60)).map(x => x) as number[]);

    useEffect(() => {
        if (!gameInstance) return;

        gameInstance.engine.registerFrameListener({
            onEachSecond() {
                if (!currentGameSession) return;

                setFps(Time.FPS);
                if (display.showPerformanceCharts) setFpsHistory([...fpsHistory, Time.FPS]);

                setPing(currentGameSession.ping ?? 0);
                if (display.showPerformanceCharts) setPingHistory([...pingHistory, currentGameSession.ping ?? 0]);
            },
        });
    }, [gameInstance, fpsHistory, pingHistory, currentGameSession, display.showPerformanceCharts]);

    useEffect(() => {
        // update color
        let newFpsColor = palette.text.primary;
        if (fps < 55 && fps >= 30) newFpsColor = HUDPerformanceColor.YELLOW;
        else if (fps < 30) newFpsColor = HUDPerformanceColor.RED;
        setFpsColor(newFpsColor);

        let newPingColor = palette.text.primary;
        if (ping > 20 && ping <= 50) newPingColor = HUDPerformanceColor.YELLOW;
        else if (ping > 50) newPingColor = HUDPerformanceColor.RED;
        setPingColor(newPingColor);

        if (!display.showPerformanceCharts) return;
        // update FPS history (limit to last minute)
        if (fpsHistory.length > 60) {
            setFpsHistory(fpsHistory.slice(fpsHistory.length - 60, fpsHistory.length));
        }

        if (pingHistory.length > 60) {
            setPingHistory(pingHistory.slice(pingHistory.length - 60, pingHistory.length));
        }
    }, [fps, fpsHistory, ping, pingHistory, palette, display.showPerformanceCharts]);

    return !!gameInstance && !!currentGameSession && display.showPerformance ? (
        <Card className={style.hud}>
            <CardHeader title='Performance' avatar={<AnalyticsIcon />} />
            <CardContent>
                <Typography color={fpsColor}>
                    <SixtyFpsSelectIcon style={{ verticalAlign: 'middle' }} /> FPS: {fps}
                </Typography>
                {display.showPerformanceCharts && (
                    <LineChart data={fpsHistory} width={300} height={50}>
                        <YAxis dataKey={v => v} tick={true} axisLine={true} width={20} />
                        <Line
                            type='monotone'
                            dataKey={v => v}
                            stroke={palette.text.primary}
                            isAnimationActive={false}
                            dot={false}
                        />
                        <ReferenceLine y={60} strokeDasharray='3 3' stroke='#aaaaaa' />
                        <ReferenceLine y={55} strokeDasharray='3 3' stroke='#ffbb00' />
                        <ReferenceLine y={30} strokeDasharray='3 3' stroke='#f24a38' />
                    </LineChart>
                )}
            </CardContent>
            <CardContent>
                <Typography color={pingColor}>
                    <NetworkPingIcon style={{ verticalAlign: 'middle' }} /> Ping: {ping}
                </Typography>
                {display.showPerformanceCharts && (
                    <LineChart data={pingHistory} width={300} height={50}>
                        <YAxis dataKey={v => v} tick={true} axisLine={true} width={20} />
                        <Line
                            type='monotone'
                            dataKey={v => v}
                            stroke={palette.text.primary}
                            isAnimationActive={false}
                            dot={false}
                        />
                        <ReferenceLine y={0} strokeDasharray='3 3' stroke='#aaaaaa' />
                        <ReferenceLine y={20} strokeDasharray='3 3' stroke='#ffbb00' />
                        <ReferenceLine y={50} strokeDasharray='3 3' stroke='#f24a38' />
                    </LineChart>
                )}
            </CardContent>
        </Card>
    ) : (
        <></>
    );
};

export default HUDPerformance;
