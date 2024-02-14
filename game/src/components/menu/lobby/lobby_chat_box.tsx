import { Box, Divider, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGameSession } from "../../../hooks/use_game_session";
import './lobby_screen.sass';
import { useTranslation } from "react-i18next";

import ChatIcon from '@mui/icons-material/Chat';

const LobbyChatBox = () => {

    const { chat, currentLobby } = useGameSession();

    const [msg, setMsg] = useState("");
    const [isAtChatEnd, setIsAtChatEnd] = useState(true);
    const { t } = useTranslation(["lobby"]);
    const chatboxRef = useRef<HTMLUListElement>() as React.MutableRefObject<HTMLUListElement>;

    const sendMessage = useCallback(() => {
        currentLobby?.chat.sendMessage(msg);
        setMsg("");
    }, [msg, currentLobby?.chat]);

    const handleChatLogScroll = useCallback((e: React.UIEvent<HTMLUListElement, UIEvent>) => {
        setIsAtChatEnd(e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight);
    }, []);

    useEffect(() => {
        if (isAtChatEnd) {
            chatboxRef.current.scrollTo({ top: chatboxRef.current.scrollHeight });
        }
    }, [chat, isAtChatEnd]);

    return (        
        <>
            <Typography sx={{ marginBottom: '1em'}}><ChatIcon sx={{ verticalAlign: 'middle', marginRight: '0.3em'}}/>{t("lobby:chat")}</Typography>
            <Box display="flex" flexDirection="column" justifyContent="space-between" component={Paper}>
                <List sx={{ flexGrow: 1, overflowY: 'auto', height: '300px' }} onScroll={e => handleChatLogScroll(e)} ref={chatboxRef}>
                    <ListItem key="info">
                        <ListItemText secondary={t("lobby:chat_info_msg")}/>
                    </ListItem>
                    {
                        chat.map(msg => (
                            <ListItem key={crypto.randomUUID()}>
                                <ListItemText primary={msg.msg} secondary={msg.sender} />
                            </ListItem>
                        ))
                    }
                </List>
                <Divider/>
                <Paper component="form" onSubmit={e => {
                        e.preventDefault();
                        sendMessage();
                }}>
                    <TextField variant="standard" value={msg} onChange={e => setMsg(e.currentTarget.value)} fullWidth />
                </Paper>
            </Box>
        </>
    );
}

export default LobbyChatBox;