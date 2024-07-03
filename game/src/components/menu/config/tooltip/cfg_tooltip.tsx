import React from 'react';
import { Stack, Typography } from '@mui/material';
import styles from './cfg_tooltip.module.scss';

const CfgTooltip: React.FC<{ currentTooltip?: { title: string; content: string } }> = ({ currentTooltip }) => {
    return (
        <Stack spacing={2} className={styles.main}>
            <Typography variant='h6'>{currentTooltip?.title}</Typography>
            <Typography variant='body1' className={styles.body}>
                {currentTooltip?.content}
            </Typography>
        </Stack>
    );
};

export default CfgTooltip;
