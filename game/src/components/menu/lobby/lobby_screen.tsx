import { Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_screen.sass';

import PublicIcon from '@mui/icons-material/Public';
import { useGame } from "../../../hooks/use_game";


const LobbyScreen: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["lobby_list", "common"]);
    const { username, currentLobby } = useGameSession();
    const { gameInstance } = useGame();


    useEffect(() => {
        if (!gameInstance) return;
        gameInstance.state.server?.requestLobbies();
    }, [gameInstance]);

    return (
        <Grid container className="lobby-screen" style={{ backgroundColor: palette.background.default }} justifyContent="center" alignContent="start">
        
            <Stack spacing={5} width="100%">
                <Grid>
                    <Typography variant="h4">
                        <PublicIcon style={{marginRight: "0.5em", fontSize: "1em", verticalAlign: "middle"}}/>
                        { t("lobby_list:lobbies") }
                    </Typography>
                    <Typography variant="caption">
                        { `${t("common:playing_as")} ${username} @ ${currentLobby?.state.value?.name}` }
                    </Typography>
                    <Button onClick={() => currentLobby?.leave()}>Leave</Button>
                </Grid>

            </Stack>
        </Grid>
    );
}

export default LobbyScreen;