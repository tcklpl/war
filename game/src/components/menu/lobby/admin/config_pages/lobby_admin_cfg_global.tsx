import { Box, Table, TableBody } from "@mui/material";
import { useEffect, useState } from "react"
import { useGameSession } from "../../../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";
import LobbyAdminConfigOption from "./components/lobby_admin_cfg_option";


const LobbyAdminConfigScreenGlobal = ({ disabled }: { disabled: boolean }) => {

    const { currentLobbyState, modifyLobbyState } = useGameSession();
    const { t } = useTranslation(["common", "lobby"]);

    const [joinable, setJoinable] = useState(currentLobbyState?.joinable ?? false);
    const [turnTimeoutSeconds, setTurnTimeoutSeconds] = useState(currentLobbyState?.game_config.turn_timeout_seconds ?? 0);

    useEffect(() => {
        modifyLobbyState(s => {
            s.joinable = joinable;
            s.game_config.turn_timeout_seconds = turnTimeoutSeconds;
            return s;
        });
    }, [joinable, turnTimeoutSeconds, modifyLobbyState]);

    return currentLobbyState ? (
        <Box width="100%">
            <Table width="100%">
                <TableBody>
                    <LobbyAdminConfigOption options={{
                        type: "boolean",
                        name: t("lobby:cfg_global_joinable"),
                        description: t("lobby:cfg_global_joinable_desc"),
                        value: joinable,
                        setter: setJoinable
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_global_turn_timeout_seconds"),
                        description: t("lobby:cfg_global_turn_timeout_seconds_desc"),
                        value: turnTimeoutSeconds,
                        setter: setTurnTimeoutSeconds,
                        min: 1,
                        max: 300,
                        disabled: disabled
                    }}/>
                </TableBody>
            </Table>
        </Box>
    ) : <></>;
}

export default LobbyAdminConfigScreenGlobal;