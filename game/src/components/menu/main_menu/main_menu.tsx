import { Button, Grid, Stack } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayerNameBox from "../config/player_name_box/player_name_box";
import { useGameSession } from "../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";

const MainMenu: React.FC = () => {

    const { username } = useGameSession();
    const navigate = useNavigate();
    const { t } = useTranslation(["server_list", "config"]);

    return (
        <Grid container style={{ height: '100vh' }} justifyContent="center" alignContent="center">
            <Stack spacing={2}>
                <PlayerNameBox/>
                <Button variant="outlined" startIcon={<PublicIcon/>} fullWidth={true} disabled={!username} onClick={() => navigate("/servers")}>{ t("server_list:server_list") }</Button>
                <Link to="/config"><Button variant="outlined" startIcon={<SettingsIcon/>} fullWidth={true}>{ t("config:config") }</Button></Link>
            </Stack>
        </Grid>
    );
};

export default MainMenu;