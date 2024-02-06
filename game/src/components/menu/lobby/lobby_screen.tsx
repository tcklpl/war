import { Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemText, Paper, Stack, Typography, useTheme } from "@mui/material";
import React from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_screen.sass';

import PublicIcon from '@mui/icons-material/Public';
import ShieldIcon from '@mui/icons-material/Shield';
import LobbyChatBox from "./lobby_chat_box";
import { useConfirmation } from "../../../hooks/use_confirmation";

const LobbyScreen: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["lobby", "common"]);
    const { username, currentLobby, currentLobbyState } = useGameSession();
    const { enqueueConfirmation } = useConfirmation();

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
                                <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto' }} component={Paper}>
                                    {
                                        currentLobbyState.players.map(p => (
                                            <ListItem key={p.name} secondaryAction={
                                                <IconButton edge="end">
                                                    {p.is_lobby_owner && <ShieldIcon/>}
                                                </IconButton>
                                            }>
                                                <ListItemText>
                                                    {p.name} 
                                                    {p.is_lobby_owner && " (Lobby Owner)"}
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