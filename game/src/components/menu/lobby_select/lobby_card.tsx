import { Card, CardContent, Stack, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { LobbyListStateLobby } from "../../../../../protocol";
import { useTranslation } from "react-i18next";
import './lobby_select.sass';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const LobbyCard: React.FC<{
    lobby: LobbyListStateLobby,
    onJoinAttempt: () => void
}> = ({ lobby, onJoinAttempt }) => {

    const { t } = useTranslation(["lobby_list"]);

    const attemptJoin = useCallback(() => {
        if (!lobby.joinable) return;
        onJoinAttempt();
    }, [lobby, onJoinAttempt]);

    return (
        <Card elevation={3} onDoubleClick={() => attemptJoin()}>
            <CardContent>
                <Typography>{lobby.name}</Typography>
                <Typography color="GrayText">{`${t("lobby_list:owner")}: ${lobby.owner_name}`}</Typography>
                <Typography color="GrayText">{`${t("lobby_list:players_in_lobby")}: ${lobby.player_count}`}</Typography>
                <Typography color="GrayText">
                    { lobby.joinable ? <CheckIcon className="lobby-card-icon"/> : <CloseIcon className="lobby-card-icon"/> }
                    {`${t("lobby_list:joinable")}`}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default LobbyCard;