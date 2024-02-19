import React from "react"
import { Stack, Typography } from "@mui/material";
import "./cfg_tooltip.scss";

const CfgTooltip: React.FC<{currentTooltip?: {title: string, content: string}}> = ({ currentTooltip }) => {
    
    return (
        <Stack spacing={2} className="cfg-tooltip">
            <Typography variant="h6" className="cfg-tooltip-title">{currentTooltip?.title}</Typography>
            <Typography variant="body1" className="cfg-tooltip-body">{currentTooltip?.content}</Typography>
        </Stack>
    );
}

export default CfgTooltip;