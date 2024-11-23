import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Grid2, Stack, useTheme } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import CfgScreen from '../../../menu/config/screen/cfg_screen';
import style from './esc_menu.module.scss';

const EscMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [currentRightScreen, setCurrentRightScreen] = useState<ReactNode>();
    const { palette } = useTheme();

    useEffect(() => {
        function updateOpenState(e: KeyboardEvent) {
            if (e.key.toLowerCase() === 'escape') {
                setOpen(!open);
            }
        }

        document.addEventListener('keydown', updateOpenState);
        setCurrentRightScreen(undefined);

        return () => {
            document.removeEventListener('keydown', updateOpenState);
        };
    }, [open]);

    return open ? (
        <Grid2 container className={style.screen} width={'100%'}>
            <Grid2
                size={{ xs: 4, md: 2 }}
                className={style.categories}
                style={{ backgroundColor: palette.background.default }}
                justifyContent='center'
            >
                <Stack spacing={1} paddingX={'1em'}>
                    <Button
                        color='primary'
                        onClick={() => {
                            setOpen(false);
                        }}
                        fullWidth={true}
                        style={{ justifyContent: 'flex-end' }}
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
                        style={{ justifyContent: 'flex-end' }}
                        startIcon={<SettingsIcon />}
                    >
                        Settings
                    </Button>
                </Stack>
            </Grid2>

            <Grid2 size={{ xs: 8, md: 10 }}>{currentRightScreen}</Grid2>
        </Grid2>
    ) : (
        <></>
    );
};

export default EscMenu;
