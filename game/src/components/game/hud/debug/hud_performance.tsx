import React, { useEffect, useState } from "react"
import { useGame } from "../../../../hooks/use_game";
import { Time } from "../../../../engine/time";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import SixtyFpsSelectIcon from '@mui/icons-material/SixtyFpsSelect';
import "./debug_huds.sass";
import { HUDPerformanceColor } from "./hud_performance_colors";
import { LineChart, Line, YAxis, ReferenceLine } from 'recharts';

const HUDPerformance: React.FC = () => {

    const { gameInstance } = useGame();
    const [ fps, setFps ] = useState(0);
    const [ fpsColor, setFpsColor ] = useState<HUDPerformanceColor>(HUDPerformanceColor.WHITE);
    const [ fpsHistory, setFpsHistory ] = useState<number[]>(Array.apply(0, Array(60)).map(x => x) as number[]);

    useEffect(() => {
        if (!gameInstance) return;
        
        gameInstance.engine.registerFrameListener({
            onEachSecond() {
                setFps(Time.FPS);
                setFpsHistory([...fpsHistory, Time.FPS]);
            }
        });

    }, [ gameInstance, fpsHistory ]);

    useEffect(() => {
        // update color
        let color = HUDPerformanceColor.WHITE;
        if (fps < 55 && fps >= 30) color = HUDPerformanceColor.YELLOW
        else if (fps < 30) color = HUDPerformanceColor.RED;
        setFpsColor(color);

        // update FPS history (limit to last minute)
        if (fpsHistory.length > 60) {
            setFpsHistory(fpsHistory.slice(fpsHistory.length - 60, fpsHistory.length));
        }
    }, [fps, fpsHistory]);

    return !!gameInstance ? (
        <Card className="hud-debug-performance">
            <CardHeader title="Performance" avatar={<SixtyFpsSelectIcon/>} />
            <CardContent>
                <Typography color={fpsColor}>FPS: {fps}</Typography>
                <LineChart data={fpsHistory} width={300} height={50}>
                    <YAxis dataKey={(v) => v} tick={true} axisLine={true} width={20} />
                    <Line type="monotone" dataKey={(v) => v} stroke="#ffffff" isAnimationActive={false} dot={false} />
                    <ReferenceLine y={60} strokeDasharray="3 3" stroke="#aaaaaa" />
                    <ReferenceLine y={55} strokeDasharray="3 3" stroke="#ffbb00" />
                    <ReferenceLine y={30} strokeDasharray="3 3" stroke="#f24a38" />
                </LineChart>
            </CardContent>
        </Card>
    ) : <></>;
}

export default HUDPerformance;