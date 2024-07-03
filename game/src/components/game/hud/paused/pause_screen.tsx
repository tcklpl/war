import { useTranslation } from 'react-i18next';
import { FunctionComponent, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { useConfirmation } from '../../../../hooks/use_confirmation';
import './pause_screen.scss';

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';

interface PauseScreenProps {}
type LobbyOwnerActions = 'keep paused' | 'save and exit' | 'move on';

const PauseScreen: FunctionComponent<PauseScreenProps> = () => {
    const { t } = useTranslation(['ingame']);
    const { palette } = useTheme();
    const { enqueueConfirmation } = useConfirmation();

    const [action, setAction] = useState<LobbyOwnerActions>('keep paused');
    const [description, setDescription] = useState(t('ingame:pause_action_keep_paused_desc'));

    const handleActionChange = (event: React.MouseEvent<HTMLElement>, newAction: LobbyOwnerActions) => {
        setAction(newAction);
        switch (newAction) {
            case 'keep paused':
                setDescription(t('ingame:pause_action_keep_paused_desc'));
                break;
            case 'save and exit':
                setDescription(t('ingame:pause_action_save_and_exit_desc'));
                break;
            case 'move on':
                setDescription(t('ingame:pause_action_move_on_desc'));
                break;
        }
    };

    const confirmAction = () => {
        switch (action) {
            case 'keep paused':
                break;
            case 'save and exit':
                enqueueConfirmation({
                    title: t('ingame:pause_action_confirm'),
                    description: t('ingame:pause_action_confirm_save'),
                    onConfirm() {},
                });
                break;
            case 'move on':
                enqueueConfirmation({
                    title: t('ingame:pause_action_confirm'),
                    description: t('ingame:pause_action_confirm_move_on'),
                    onConfirm() {},
                });
                break;
        }
    };

    return (
        <Box className='pause-screen-outer' sx={{ background: alpha(palette.background.default, 0.8) }}>
            <Container className='pause-screen-container'>
                <Box className='pause-screen-inner'>
                    <Typography variant='h2'>
                        <PauseCircleOutlineIcon fontSize='inherit' />
                    </Typography>
                    <Typography variant='h3'>{t('ingame:paused')}</Typography>
                    <Typography variant='h5'>{t('ingame:pause_reason_disconnect')}</Typography>
                    <Typography variant='body1'>{t('ingame:pause_reason_disconnect_desc_owner')}</Typography>

                    <ToggleButtonGroup
                        value={action}
                        exclusive
                        onChange={handleActionChange}
                        className='pause-screen-buttons'
                    >
                        <ToggleButton value={'keep paused'} size='large'>
                            <Stack direction='column' width='10em' display='flex' alignItems='center'>
                                <PauseCircleOutlineIcon />
                                <Typography variant='body1'>{t('ingame:pause_action_keep_paused')}</Typography>
                            </Stack>
                        </ToggleButton>
                        <ToggleButton value={'save and exit'} size='large'>
                            <Stack direction='column' width='10em' display='flex' alignItems='center'>
                                <SaveIcon />
                                <Typography variant='body1'>{t('ingame:pause_action_save_and_exit')}</Typography>
                            </Stack>
                        </ToggleButton>
                        <ToggleButton value={'move on'} size='large'>
                            <Stack direction='column' width='10em' display='flex' alignItems='center'>
                                <GroupRemoveIcon />
                                <Typography variant='body1'>{t('ingame:pause_action_move_on')}</Typography>
                            </Stack>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box className='pause-screen-info'>
                        <Typography variant='body1'>{description}</Typography>
                    </Box>
                    <Button variant='outlined' onClick={confirmAction}>
                        {t('ingame:pause_action_confirm')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PauseScreen;
