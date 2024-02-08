import { Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_screen.sass';
import LobbyChatBox from "./lobby_chat_box";
import { useConfirmation } from "../../../hooks/use_confirmation";

import PublicIcon from '@mui/icons-material/Public';
import ShieldIcon from '@mui/icons-material/Shield';
import LogoutIcon from '@mui/icons-material/Logout';

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

    return (
        <Grid container className="lobby-screen" style={{ backgroundColor: palette.background.default }} justifyContent="center" alignContent="start">
        
            <Stack spacing={5} width="100%" height="100%">
                { currentLobby && currentLobbyState ? (
                    <>
                        <Grid>
                            <Typography variant="h4">
                                <PublicIcon style={{marginRight: "0.5em", fontSize: "1em", verticalAlign: "middle"}}/>
                                { t("lobby:lobbies") }
                            </Typography>
                            <Typography variant="caption">
                                { `${t("common:playing_as")} ${username} @ ${currentLobbyState.name}` }
                            </Typography>
                            <Button onClick={() => {
                                enqueueConfirmation({
                                    title: t("lobby:leave_lobby"),
                                    description: t("lobby:leave_lobby_desc"),
                                    onConfirm() {
                                        currentLobby.leave();
                                    }
                                });
                            }}>{ t("lobby:leave_lobby") }</Button>
                        </Grid>

                        <Grid container height="100%">

                            <Grid item xs={3} display="flex" flexDirection="column" padding={2}>
                                <Typography>{ t("lobby:player_list") }</Typography>

                                { isLobbyOwner && (
                                    <Menu anchorEl={playerListCtxAnchorEl} open={!!playerListCtxAnchorEl} onClose={closePlayerListCtxMenu}>
                                        <MenuItem onClick={() => {
                                            closePlayerListCtxMenu();
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

                            <Grid item xs={7}>
                                Info
                            </Grid>

                            <Grid item xs={2}>
                                Flair
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>{ t("lobby:loading_lobby_data") }</>
                )}

            </Stack>
        </Grid>
    );
}

export default LobbyScreen;