import React, { ReactNode, useEffect, useState } from 'react';
import './pause_screen.scss';
import { Button, Grid, Stack, useTheme } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SettingsIcon from '@mui/icons-material/Settings';
import CfgScreen from '../../../menu/config/cfg_screen';

const PauseScreen: React.FC = () => {
    const [isOpen, setOpen] = useState(false);
    const [currentRightScreen, setCurrentRightScreen] = useState<ReactNode>();
    const { palette } = useTheme();

    useEffect(() => {
        function updateOpenState(e: KeyboardEvent) {
            if (e.key.toLowerCase() === 'escape') {
                setOpen(!isOpen);
            }
        }

        document.addEventListener('keydown', updateOpenState);
        setCurrentRightScreen(undefined);

        return () => {
            document.removeEventListener('keydown', updateOpenState);
        };
    }, [isOpen]);

    return isOpen ? (
        <Grid container className='pause-screen'>
            <Grid
                item
                container
                xs={4}
                md={2}
                className='pause-screen-categories'
                style={{ backgroundColor: palette.background.default }}
                direction='column'
                justifyContent='center'
            >
                <Stack spacing={1}>
                    <Button
                        color='primary'
                        onClick={() => {
                            setOpen(false);
                        }}
                        fullWidth={true}
                        style={{ justifyContent: 'flex-start' }}
                        startIcon={<KeyboardBackspaceIcon />}
                    >
                        Resume
                    </Button>
                    <Button
                        color='primary'
                        onClick={() => {
                            setCurrentRightScreen(<CfgScreen />);
                        }}
                        fullWidth={true}
                        style={{ justifyContent: 'flex-start' }}
                        startIcon={<SettingsIcon />}
                    >
                        Settings
                    </Button>
                </Stack>
            </Grid>

            <Grid item xs={8} md={10} className='pause-screen-options'>
                {currentRightScreen}
            </Grid>
        </Grid>
    ) : (
        <></>
    );
};

export default PauseScreen;
