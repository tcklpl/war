import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react"
import "./server_select.sass";
import { ServerConnectionCandidate } from "../../../game/server/connection/server_connection_candidate";
import { useGame } from "../../../hooks/use_game";
import { URLUtils } from "../../../utils/url_utils";
import { useTranslation } from "react-i18next";

const ServerSelectAddServerScreen: React.FC<{
    open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    servers: ServerConnectionCandidate[], setServers: React.Dispatch<React.SetStateAction<ServerConnectionCandidate[]>>,
    serverBeingEdited: ServerConnectionCandidate | undefined, setServerBeingEdited: React.Dispatch<React.SetStateAction<ServerConnectionCandidate | undefined>>
}> = ({ open, setOpen, servers, setServers, serverBeingEdited, setServerBeingEdited }) => {

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const { gameInstance } = useGame();
    const { t } = useTranslation(["server_list"]);

    const [nameError, setNameError] = useState("");
    const [addressError, setAddressError] = useState("");

    useEffect(() => {
        setName("");
        setAddress("");
        setNameError("");
        setAddressError("");

        if (serverBeingEdited) {
            setName(serverBeingEdited.listInfo.localName);
            setAddress(serverBeingEdited.listInfo.address);
        }

    }, [open, serverBeingEdited]);

    const registerNewServer = useCallback((name: string, address: string) => {
        if (!gameInstance) {
            console.warn('Trying to register a new server without a game instance');
            return;
        }
        (async () => {
            const newServerInfo = await gameInstance.serverList.addServer(name, address);
            await gameInstance.serverList.updateListPositions();
            setServers([...servers, new ServerConnectionCandidate(newServerInfo)]);
        })();
    }, [gameInstance, servers, setServers]);

    const saveCurrentServer = useCallback((name: string, address: string) => {
        if (!gameInstance) {
            console.warn('Trying to edit a new server without a game instance');
            return;
        }
        if (!serverBeingEdited) {
            console.warn('Trying to edit a server that is not even here, wtf');
            return;
        }
        (async () => {
            serverBeingEdited.listInfo.localName = name;
            serverBeingEdited.listInfo.address = address;
            await gameInstance.serverList.editServer(serverBeingEdited.listInfo);
            await gameInstance.serverList.updateListPositions();
            setServers([...servers]);
        })();
    }, [gameInstance, servers, setServers, serverBeingEdited]);

    const validate = useCallback(() => {

        setNameError("");
        setAddressError("");

        const trimmedName = name.trim();
        const trimmedAddress = address.trim();

        if (!trimmedName) {
            setNameError(t("server_list:add_server_error_no_name"));
            return;
        }
        if (!trimmedAddress) {
            setAddressError(t("server_list:add_server_error_no_address"));
            return;
        }

        const actualAddress = URLUtils.prepareServerURL(trimmedAddress);

        for (const sv of servers) {
            if (sv.listInfo.localName === name && serverBeingEdited?.listInfo.id !== sv.listInfo.id) {
                setNameError(t("server_list:add_server_error_name_already_exists"));
                return;
            }
            if (sv.listInfo.address === actualAddress && serverBeingEdited?.listInfo.id !== sv.listInfo.id) {
                setAddressError(t("server_list:add_server_error_address_already_exists"));
                return;
            }
        }

        if (!!serverBeingEdited) {
            saveCurrentServer(trimmedName, actualAddress);
        } else {
            registerNewServer(trimmedName, actualAddress);
        }

        setOpen(false);

    }, [registerNewServer, saveCurrentServer, t, address, name, servers, setOpen, serverBeingEdited]);

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false);
            setServerBeingEdited(undefined);
        }}>
            <DialogTitle>{ !serverBeingEdited ? t("server_list:add_server") : t("server_list:edit_server") }</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <DialogContentText>
                        { t("server_list:add_server_desc") }
                    </DialogContentText>
                    <TextField id="server-name" label="Name" onChange={e => setName(e.currentTarget.value)} value={name} error={!!nameError} helperText={nameError} />
                    <TextField id="server-address" label="Address" onChange={e => setAddress(e.currentTarget.value)} value={address} error={!!addressError} helperText={addressError} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => validate()}>{ !serverBeingEdited ? t("server_list:add_server") : t("server_list:edit_server") }</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ServerSelectAddServerScreen;