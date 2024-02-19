import { Button, Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_select.scss';

import PublicIcon from '@mui/icons-material/Public';
import { useGame } from "../../../hooks/use_game";
import LobbyCard from "./lobby_card";
import LobbySelectCreateLobby from "./lobby_select_create_lobby";
import { useNavigate } from "react-router-dom";

const LobbySelectScreen: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["lobby", "common"]);
    const { username, lobbies, currentLobby } = useGameSession();
    const { gameInstance } = useGame();
    const navigate = useNavigate();

    const [createLobbyOpen, setCreateLobbyOpen] = useState(false);

    useEffect(() => {
        if (!gameInstance) return;
        gameInstance.state.server?.requestLobbies();
    }, [gameInstance]);

    useEffect(() => {
        if (currentLobby) navigate("/lobby");
    }, [currentLobby, navigate]);

    return (
        <Container>
            <Grid container className="lobby-select-screen" style={{ backgroundColor: palette.background.default }} justifyContent="center" alignContent="start">

                <LobbySelectCreateLobby open={createLobbyOpen} setOpen={setCreateLobbyOpen} />
            
                <Stack spacing={5} width="100%">
                    <Grid>
                        <Typography variant="h4">
                            <PublicIcon style={{marginRight: "0.5em", fontSize: "1em", verticalAlign: "middle"}}/>
                            { t("lobby:lobbies") }
                        </Typography>
                        <Typography variant="caption">
                            { `${t("common:playing_as")} ${username}` }
                        </Typography>
                    </Grid>

                    <Stack direction="row">
                        <Button disabled={!lobbies || lobbies.lobbies.length === lobbies.max_lobbies} onClick={() => setCreateLobbyOpen(true)}>{ t("lobby:create_lobby") }</Button>
                    </Stack>

                    <Grid container spacing={{ xs: 2 }}>
                        { !!lobbies ? (
                            lobbies.lobbies.map(lobby => (
                                <Grid item key={lobby.name} xs={4}>
                                    <LobbyCard lobby={lobby} onJoinAttempt={() => gameInstance?.state.server?.joinLobby(lobby.name)}/>
                                </Grid>
                            ))
                        ) : (
                            <>No rooms</>
                        )}
                    </Grid>

                </Stack>
            </Grid>
        </Container>
    );
}

export default LobbySelectScreen;