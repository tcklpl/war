import { Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../hooks/use_game_session";

import PublicIcon from '@mui/icons-material/Public';
import { useGame } from "../../../hooks/use_game";

const ServerRoomSelectScreen: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["server_list", "common"]);
    const { username } = useGameSession();
    const { gameInstance } = useGame();
    const { lobbies } = useGameSession();

    useEffect(() => {
        if (!gameInstance) return;
        gameInstance.state.server?.requestRoomList();
    }, [gameInstance]);

    return (
        <Container>
            <Grid container className="server-room-select-screen" style={{ backgroundColor: palette.background.default }} justifyContent="center" alignContent="center">
            
                <Stack spacing={5} width="100%">
                    <Grid>
                        <Typography variant="h4">
                            <PublicIcon style={{marginRight: "0.5em", fontSize: "1em", verticalAlign: "middle"}}/>
                            { t("server_list:server_list") } 2222
                        </Typography>
                        <Typography variant="caption">
                            { `${t("common:playing_as")} ${username}` }
                        </Typography>
                    </Grid>

                    { !!lobbies ? (
                        <>Rooms</>
                    ) : (
                        <>No rooms</>
                    )}

                </Stack>
            </Grid>
        </Container>
    );
}

export default ServerRoomSelectScreen;