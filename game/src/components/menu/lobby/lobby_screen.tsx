import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
    Box,
    Divider,
    Grid2,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Typography,
    useTheme,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GameParty } from '../../../../../protocol';
import { useConfirmation } from '../../../hooks/use_confirmation';
import { useGameSession } from '../../../hooks/use_game_session';
import LobbyAdminConfigScreen from './admin/lobby_admin_cfg';
import LobbyChatBox from './lobby_chat_box';
import './lobby_screen.scss';
import LobbyPartySelectorScreen from './party_selector/lobby_party_selector';

import FlagIcon from '@mui/icons-material/Flag';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import StopIcon from '@mui/icons-material/Stop';
import AnarchismIcon from '../../../images/icons/anarchism/anarchism_icon';
import CapitalismIcon from '../../../images/icons/capitalism/capitalism_icon';
import CrownIcon from '../../../images/icons/crown_icon';
import FeudalismIcon from '../../../images/icons/feudalism/feudalism_icon';
import SocialismIcon from '../../../images/icons/socialism/socialism_icon';

const LobbyScreen: React.FC = () => {
    const { palette } = useTheme();
    const { t } = useTranslation(['lobby', 'common', 'parties']);
    const { username, currentLobby, currentLobbyState, gameStartingIn, currentGameSession } = useGameSession();
    const { enqueueConfirmation } = useConfirmation();
    const navigate = useNavigate();
    const isLobbyOwner = currentLobbyState?.players.find(p => p.name === username)?.is_lobby_owner ?? false;
    const canGameStart = !currentLobbyState?.players.some(p => p.party === 'not_set');
    const isGameStarting = gameStartingIn !== undefined;

    const [playerListCtxAnchorEl, setPlayerListCtxAnchorEl] = useState<null | HTMLElement>(null);
    const [playerListCtxSelectedPlayer, setPlayerListCtxSelectedPlayer] = useState<string>();
    const closePlayerListCtxMenu = () => {
        setPlayerListCtxAnchorEl(null);
        setPlayerListCtxSelectedPlayer(undefined);
    };

    const [infoTab, setInfoTab] = useState<'parties' | 'config'>('parties');

    useEffect(() => {
        if (!isLobbyOwner) setInfoTab('parties');
    }, [isLobbyOwner]);

    useEffect(() => {
        if (isGameStarting) {
            setInfoTab('parties');
        }
    }, [isGameStarting]);

    useEffect(() => {
        if (currentGameSession) {
            navigate('/game');
        }
    }, [currentGameSession, navigate]);

    const partyDecoratorMap = new Map<GameParty, { name: string; icon: ReactElement }>([
        ['anarchism', { name: t('parties:anarchism'), icon: <AnarchismIcon /> }],
        ['feudalism', { name: t('parties:feudalism'), icon: <FeudalismIcon /> }],
        ['socialism', { name: t('parties:socialism'), icon: <SocialismIcon /> }],
        ['capitalism', { name: t('parties:capitalism'), icon: <CapitalismIcon /> }],
    ]);

    return (
        <Grid2
            className='lobby-screen'
            style={{ backgroundColor: palette.background.default }}
            justifyContent='center'
            alignContent='start'
            height='100%'
        >
            {currentLobby && currentLobbyState ? (
                <Box display='flex' flexDirection='column' height='100%' width='100%'>
                    <Box display='flex' flexGrow={1} height='100%' width='100%'>
                        <Grid2 container position='relative' flexGrow='1'>
                            <Grid2 size={3} display='flex' height='100%' flexDirection='column' padding={2}>
                                <Typography sx={{ marginBottom: '1em' }}>
                                    <PersonIcon sx={{ verticalAlign: 'middle' }} /> {t('lobby:player_list')}
                                </Typography>

                                {isLobbyOwner && (
                                    <Menu
                                        anchorEl={playerListCtxAnchorEl}
                                        open={!!playerListCtxAnchorEl}
                                        onClose={closePlayerListCtxMenu}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                closePlayerListCtxMenu();
                                                setInfoTab('parties');
                                                currentLobby.transferOwnership(playerListCtxSelectedPlayer ?? '');
                                            }}
                                            disableRipple
                                            disabled={playerListCtxSelectedPlayer === username}
                                        >
                                            <ListItemIcon>
                                                <ShieldIcon />
                                            </ListItemIcon>
                                            <ListItemText>{t('lobby:transfer_lobby_ownership')}</ListItemText>
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                closePlayerListCtxMenu();
                                                currentLobby.kickPlayer(playerListCtxSelectedPlayer ?? '');
                                            }}
                                            disableRipple
                                            disabled={playerListCtxSelectedPlayer === username}
                                        >
                                            <ListItemIcon>
                                                <LogoutIcon />
                                            </ListItemIcon>
                                            <ListItemText>{t('lobby:kick_player')}</ListItemText>
                                        </MenuItem>
                                    </Menu>
                                )}

                                <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto' }} component={Paper}>
                                    {currentLobbyState.players.map(p => (
                                        <ListItem
                                            key={p.name}
                                            secondaryAction={
                                                <IconButton edge='end' disableRipple>
                                                    {p.is_lobby_owner && <CrownIcon />}
                                                </IconButton>
                                            }
                                            onClick={e => {
                                                if (isLobbyOwner) {
                                                    setPlayerListCtxAnchorEl(e.currentTarget);
                                                    setPlayerListCtxSelectedPlayer(p.name);
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                                                {p.party !== 'not_set' && partyDecoratorMap.get(p.party)?.icon}
                                            </ListItemIcon>
                                            <ListItemText>
                                                {p.name}
                                                {p.is_lobby_owner && ` (${t('lobby:lobby_owner')})`}
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ margin: 2 }} />
                                <Box maxHeight='500px'>
                                    <LobbyChatBox />
                                </Box>
                            </Grid2>

                            <Grid2 size={9} display='flex' height='100%' flexDirection='column'>
                                <TabContext value={infoTab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={(_, val) => setInfoTab(val)}>
                                            <Tab
                                                label={t('lobby:parties')}
                                                value='parties'
                                                icon={<FlagIcon />}
                                                iconPosition='start'
                                            />
                                            {isLobbyOwner && (
                                                <Tab
                                                    label={t('common:config')}
                                                    value='config'
                                                    icon={<SettingsIcon />}
                                                    iconPosition='start'
                                                    disabled={isGameStarting}
                                                />
                                            )}

                                            {isLobbyOwner && (
                                                <Tab
                                                    label={
                                                        isGameStarting ? t('lobby:cancel_start') : t('lobby:start_game')
                                                    }
                                                    value='starting'
                                                    icon={isGameStarting ? <StopIcon /> : <PlayArrowIcon />}
                                                    iconPosition='start'
                                                    sx={{ marginLeft: 'auto' }}
                                                    disableRipple
                                                    disabled={!canGameStart}
                                                    onClick={() => {
                                                        if (!isGameStarting) {
                                                            enqueueConfirmation({
                                                                title: t('lobby:start_game'),
                                                                description: t('lobby:start_game_desc'),
                                                                onConfirm() {
                                                                    currentLobby.startGame();
                                                                    setInfoTab('parties');
                                                                },
                                                                onCancel() {
                                                                    setInfoTab('parties');
                                                                },
                                                            });
                                                        } else {
                                                            currentLobby.cancelGameStart();
                                                            setInfoTab('parties');
                                                        }
                                                    }}
                                                />
                                            )}
                                            <Tab
                                                label={t('lobby:leave_lobby')}
                                                value='leaving'
                                                icon={<LogoutIcon />}
                                                iconPosition='start'
                                                sx={!isLobbyOwner ? { marginLeft: 'auto' } : {}}
                                                disableRipple
                                                onClick={() => {
                                                    enqueueConfirmation({
                                                        title: t('lobby:leave_lobby'),
                                                        description: t('lobby:leave_lobby_desc'),
                                                        onConfirm() {
                                                            currentLobby.leave();
                                                        },
                                                        onCancel() {
                                                            setInfoTab('parties');
                                                        },
                                                    });
                                                }}
                                            />
                                        </TabList>
                                    </Box>

                                    <Box sx={{ flex: '1 1 auto', display: 'flex', minHeight: 0 }}>
                                        <TabPanel value='parties' sx={{ flex: '1 1 auto' }}>
                                            <LobbyPartySelectorScreen />
                                        </TabPanel>
                                        {isLobbyOwner && (
                                            <TabPanel value='config' sx={{ flex: '1 1 auto' }}>
                                                <LobbyAdminConfigScreen />
                                            </TabPanel>
                                        )}
                                    </Box>
                                </TabContext>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Box>
            ) : (
                <>{t('lobby:loading_lobby_data')}</>
            )}
        </Grid2>
    );
};

export default LobbyScreen;
