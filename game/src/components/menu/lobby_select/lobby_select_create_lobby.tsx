import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useGame } from "../../../hooks/use_game";
import { useGameSession } from "../../../hooks/use_game_session";

const LobbySelectCreateLobby: React.FC<{
    open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ open, setOpen }) => {

    const [name, setName] = useState("");
    const [joinable, setJoinable] = useState(true);

    const { t } = useTranslation(["lobby_list", "common"]);
    const { gameInstance } = useGame();
    const { lobbies } = useGameSession();

    useEffect(() => {
        setName("");
        setJoinable(true);
    }, [open]);

    const createLobby = useCallback(() => {
        gameInstance?.state.server?.createLobby(name, joinable);
        setOpen(false);
    }, [gameInstance, name, joinable, setOpen]);

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false);
        }}>
            <DialogTitle>{ t("lobby_list:create_lobby") }</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <DialogContentText>
                        { t("lobby_list:create_lobby_desc") }
                    </DialogContentText>
                    <TextField 
                        id="server-name" 
                        label={t("common:name")} 
                        onChange={e => setName(e.currentTarget.value)} 
                        value={name} 
                        error={lobbies && !!lobbies.lobbies.find(x => x.name === name)}
                    />
                    <FormControlLabel control={<Switch checked={joinable} onChange={() => setJoinable(!joinable)}/>} label={t("lobby_list:joinable")}></FormControlLabel>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => createLobby()} disabled={lobbies && !!lobbies.lobbies.find(x => x.name === name)}>{ t("lobby_list:create_lobby") }</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LobbySelectCreateLobby;