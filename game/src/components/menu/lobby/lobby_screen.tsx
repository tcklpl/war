import { Box, Button, Container, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_screen.sass';
import LobbyChatBox from "./lobby_chat_box";
import { useConfirmation } from "../../../hooks/use_confirmation";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import ShieldIcon from '@mui/icons-material/Shield';
import LogoutIcon from '@mui/icons-material/Logout';
import LobbyPartySelectorScreen from "./party_selector/lobby_party_selector";
import LobbyAdminConfigScreen from "./admin/lobby_admin_cfg";

const LobbyScreen: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["lobby", "common"]);
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
                                <Typography>{ t("lobby:player_list") }</Typography>

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
                                                <IconButton edge="end">
                                                    {p.is_lobby_owner && <ShieldIcon/>}
                                                </IconButton>
                                            } onClick={e => {
                                                if (isLobbyOwner) {
                                                    setPlayerListCtxAnchorEl(e.currentTarget);
                                                    setPlayerListCtxSelectedPlayer(p.name);
                                                }
                                            }}>
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

                            <Grid item xs={7} display="flex" height="93%" position="relative">
                                <Box sx={{ width: '100%', typography: 'body1', height: '100%' }} position="absolute">
                                    <TabContext value={infoTab}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={(_, val) => setInfoTab(val)}>
                                                <Tab label="Parties" value="parties" />
                                                { isLobbyOwner && <Tab label="Config" value="config" /> }
                                            </TabList>
                                        </Box>

                                        <Box height="100%" position="relative">
                                            <TabPanel value="parties"><LobbyPartySelectorScreen/></TabPanel>
                                            { isLobbyOwner && 
                                                <TabPanel value="config" sx={{height: '100%'}}>
                                                    <LobbyAdminConfigScreen/>
                                                </TabPanel>
                                            }
                                        </Box>
                                    </TabContext>
                                </Box>
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