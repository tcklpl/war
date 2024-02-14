import { Box, Button, Container, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_screen.sass';
import LobbyChatBox from "./lobby_chat_box";
import { useConfirmation } from "../../../hooks/use_confirmation";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { GameParty } from "../../../../../protocol";
import LobbyPartySelectorScreen from "./party_selector/lobby_party_selector";
import LobbyAdminConfigScreen from "./admin/lobby_admin_cfg";

import ShieldIcon from '@mui/icons-material/Shield';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AnarchismIcon from "../../../images/icons/anarchism/anarchism_icon";
import FeudalismIcon from "../../../images/icons/feudalism/feudalism_ison";
import SocialismIcon from "../../../images/icons/socialism/socialism_ison";
import CapitalismIcon from "../../../images/icons/capitalism/capitalism_ison";
import CrownIcon from "../../../images/icons/crown_icon";
import FlagIcon from '@mui/icons-material/Flag';
import SettingsIcon from '@mui/icons-material/Settings';

const LobbyScreen: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["lobby", "common", "parties"]);
    const { username, currentLobby, currentLobbyState } = useGameSession();
    const { enqueueConfirmation } = useConfirmation();
    const isLobbyOwner = currentLobbyState?.players.find(p => p.name === username)?.is_lobby_owner ?? false;

    const [playerListCtxAnchorEl, setPlayerListCtxAnchorEl] = useState<null | HTMLElement>(null);
    const [playerListCtxSelectedPlayer, setPlayerListCtxSelectedPlayer] = useState<string>();
    const closePlayerListCtxMenu = () => {
        setPlayerListCtxAnchorEl(null);
        setPlayerListCtxSelectedPlayer(undefined);
    }
    
    const [infoTab, setInfoTab] = useState<"parties" | "config">("parties");

    useEffect(() => {
        if (!isLobbyOwner) setInfoTab("parties");
    }, [isLobbyOwner]);

    const partyDecoratorMap = new Map<GameParty, {name: string, icon: ReactElement}>([
        ["anarchism", { name: t("parties:anarchism"), icon: (<AnarchismIcon/>)}],
        ["feudalism", { name: t("parties:feudalism"), icon: (<FeudalismIcon/>)}],
        ["socialism", { name: t("parties:socialism"), icon: (<SocialismIcon/>)}],
        ["capitalism", { name: t("parties:capitalism"), icon: (<CapitalismIcon/>)}],
    ]);

    return (
        <Grid className="lobby-screen" style={{ backgroundColor: palette.background.default }} justifyContent="center" alignContent="start" height="100%">
            { currentLobby && currentLobbyState ? (
                <Box display="flex" flexDirection="column" height="100%">
                    <Container>
                        <Typography variant="h5">
                            <Button onClick={() => {
                                enqueueConfirmation({
                                    title: t("lobby:leave_lobby"),
                                    description: t("lobby:leave_lobby_desc"),
                                    onConfirm() {
                                        currentLobby.leave();
                                    }
                                });
                            }}><LogoutIcon style={{marginRight: "0.5em", verticalAlign: "middle"}}/> { t("lobby:leave_lobby") }</Button>
                            { t("lobby:lobby") }: { currentLobbyState.name }
                        </Typography>
                        <Typography variant="caption">
                            { `${t("common:playing_as")} ${username}` }
                        </Typography>
                    </Container>

                    <Box display="flex" flexGrow={1} height="100%">
                        <Grid container position="relative">

                            <Grid item xs={3} display="flex" height="100%" flexDirection="column" padding={2}>
                                <Typography sx={{ marginBottom: '1em' }}><PersonIcon sx={{ verticalAlign: 'middle'}}/> { t("lobby:player_list") }</Typography>

                                { isLobbyOwner && (
                                    <Menu anchorEl={playerListCtxAnchorEl} open={!!playerListCtxAnchorEl} onClose={closePlayerListCtxMenu}>
                                        <MenuItem onClick={() => {
                                            closePlayerListCtxMenu();
                                            setInfoTab("parties");
                                            currentLobby.transferOwnership(playerListCtxSelectedPlayer ?? "")
                                        }} disableRipple disabled={playerListCtxSelectedPlayer === username}>
                                            <ListItemIcon>
                                                <ShieldIcon/>
                                            </ListItemIcon>
                                            <ListItemText>
                                                { t("lobby:transfer_lobby_ownership") }
                                            </ListItemText>
                                        </MenuItem>

                                        <MenuItem onClick={() => {
                                            closePlayerListCtxMenu();
                                            currentLobby.kickPlayer(playerListCtxSelectedPlayer ?? "");
                                        }} disableRipple disabled={playerListCtxSelectedPlayer === username}>
                                            <ListItemIcon>
                                                <LogoutIcon/>
                                            </ListItemIcon>
                                            <ListItemText>
                                                { t("lobby:kick_player") }
                                            </ListItemText>
                                        </MenuItem>
                                    </Menu>
                                )}

                                <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto' }} component={Paper}>
                                    {
                                        currentLobbyState.players.map(p => (
                                            <ListItem key={p.name} secondaryAction={
                                                <IconButton edge="end" disableRipple>
                                                    {p.is_lobby_owner && <CrownIcon/>}
                                                </IconButton>
                                            } onClick={e => {
                                                if (isLobbyOwner) {
                                                    setPlayerListCtxAnchorEl(e.currentTarget);
                                                    setPlayerListCtxSelectedPlayer(p.name);
                                                }
                                            }}>
                                                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center'}}>
                                                    { p.party && partyDecoratorMap.get(p.party)?.icon }
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {p.name}
                                                    {p.is_lobby_owner && ` (${ t("lobby:lobby_owner") })`}
                                                </ListItemText>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                                <Divider sx={{ margin: 2 }}/>
                                <Box maxHeight="500px">
                                    <LobbyChatBox />
                                </Box>
                            </Grid>

                            <Grid item xs={7} display="flex" flexDirection="column" height="100%">
                                <TabContext value={infoTab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={(_, val) => setInfoTab(val)}>
                                            <Tab label="Parties" value="parties" icon={<FlagIcon/>} iconPosition="start"/>
                                            { isLobbyOwner && <Tab label="Config" value="config" icon={<SettingsIcon/>} iconPosition="start" /> }
                                        </TabList>
                                    </Box>

                                    <Box sx={{ flex: '1 1 auto', display: 'flex', minHeight: 0 }}>
                                        <TabPanel value="parties" sx={{ flex: '1 1 auto' }}>
                                            <LobbyPartySelectorScreen/>
                                        </TabPanel>
                                        { isLobbyOwner && 
                                            <TabPanel value="config" sx={{ flex: '1 1 auto' }}>
                                                <LobbyAdminConfigScreen/>
                                            </TabPanel>
                                        }
                                    </Box>
                                </TabContext>
                            </Grid>

                            <Grid item xs={2}>
                                Flair
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            ) : (
                <>{ t("lobby:loading_lobby_data") }</>
            )}
        </Grid>
    );
}

export default LobbyScreen;