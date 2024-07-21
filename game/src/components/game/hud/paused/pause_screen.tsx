import { useTranslation } from 'react-i18next';
import { FunctionComponent, useEffect, useState } from 'react';
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
import { useGameSession } from '../../../../hooks/use_game_session';

interface PauseScreenProps {}
type PauseScreenText = { reason: string; descOwner: string; descOthers: string };
type LobbyOwnerActions = 'keep paused' | 'save and exit' | 'move on';

const PauseScreen: FunctionComponent<PauseScreenProps> = () => {
    const { t } = useTranslation(['ingame']);
    const { palette } = useTheme();
    const { enqueueConfirmation } = useConfirmation();
    const { gIsPaused, gPauseReason, currentGameSession, username } = useGameSession();
    const isLobbyOwner =
        currentGameSession?.initialGameState.players.find(p => p.name === username)?.is_lobby_owner ?? false;

    const [text, setText] = useState<PauseScreenText>({ reason: '', descOwner: '', descOthers: '' });
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
                    onConfirm() {
                        currentGameSession?.pauseActionSaveAndQuit();
                    },
                });
                break;
            case 'move on':
                enqueueConfirmation({
                    title: t('ingame:pause_action_confirm'),
                    description: t('ingame:pause_action_confirm_move_on'),
                    onConfirm() {
                        currentGameSession?.pauseActionMoveOn();
                    },
                });
                break;
        }
    };

    const resumeOwnerPausedGame = () => {
        currentGameSession?.resumeGame();
    };

    useEffect(() => {
        const newText: PauseScreenText = { reason: '', descOwner: '', descOthers: '' };

        if (gPauseReason === 'player disconnected') {
            newText.reason = t('ingame:pause_reason_disconnect');
            newText.descOwner = t('ingame:pause_reason_disconnect_desc_owner');
            newText.descOthers = t('ingame:pause_reason_disconnect_desc_others');
        } else if (gPauseReason === 'owner paused') {
            newText.reason = t('ingame:pause_reason_owner');
            newText.descOwner = t('ingame:pause_reason_owner_desc_owner');
            newText.descOthers = t('ingame:pause_reason_owner_desc_others');
        }

        setText(newText);
    }, [gPauseReason, t]);

    if (!gIsPaused) return <></>;
    return (
        <Box
            className='pause-screen-outer'
            sx={{ background: alpha(palette.background.default, 0.8), pointerEvents: 'all' }}
        >
            <Container className='pause-screen-container'>
                <Box className='pause-screen-inner'>
                    <Typography variant='h2'>
                        <PauseCircleOutlineIcon fontSize='inherit' />
                    </Typography>
                    <Typography variant='h3'>{t('ingame:paused')}</Typography>
                    <Typography variant='h5'>{text.reason}</Typography>
                    <Typography variant='body1'>{isLobbyOwner ? text.descOwner : text.descOthers}</Typography>

                    {gPauseReason === 'player disconnected' && (
                        <>
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
                                        <Typography variant='body1'>
                                            {t('ingame:pause_action_save_and_exit')}
                                        </Typography>
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
                        </>
                    )}

                    {gPauseReason === 'owner paused' && isLobbyOwner && (
                        <Button variant='outlined' onClick={resumeOwnerPausedGame} sx={{ marginTop: '2em' }}>
                            {t('ingame:pause_action_resume')}
                        </Button>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default PauseScreen;
