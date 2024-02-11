import { Box, Table, TableBody } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useGameSession } from "../../../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";
import LobbyAdminConfigOption from "./components/lobby_admin_cfg_option";
import LobbyAdminConfigGroupHp from "./components/lobby_admin_cfg_group_hp";
import LobbyAdminConfigTitle from "./components/lobby_admin_cfg_title";


const LobbyAdminConfigScreenFeudalism: React.FC = () => {

    const { currentLobbyState, modifyLobbyState } = useGameSession();
    const { t } = useTranslation(["common", "lobby"]);

    const [cfg, setCfg] = useState(currentLobbyState?.game_config.party_config.feudalism);
    useEffect(() => {
        if (!cfg) return;
        modifyLobbyState(s => {
            s.game_config.party_config.feudalism = cfg;
            return s;
        });
    }, [cfg, modifyLobbyState]);

    if (!cfg) return <></>;

    return currentLobbyState ? (
        <Box width="100%" height="100%">
            <Table width="100%">
                <TableBody>

                    <LobbyAdminConfigTitle title={t("lobby:bonus")}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_feudalism_bonus_troop_bonus_on_conquering"),
                        description: t("lobby:cfg_feudalism_bonus_troop_bonus_on_conquering_desc"),
                        value: cfg.bonus.troop_bonus_on_conquering,
                        setter: (val) => {
                            cfg.bonus.troop_bonus_on_conquering = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_feudalism_su_dragon")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.dragon.hp} maxHp={cfg.special_units.dragon.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.dragon.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.dragon.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_feudalism_su_dragon_cooldown"),
                        description: t("lobby:cfg_feudalism_su_dragon_cooldown_desc"),
                        value: cfg.special_units.dragon.cooldown_after_dying,
                        setter: (val) => {
                            cfg.special_units.dragon.cooldown_after_dying = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_feudalism_su_dragon_hp_increase_rate"),
                        description: t("lobby:cfg_feudalism_su_dragon_hp_increase_rate_desc"),
                        value: cfg.special_units.dragon.hp_increase_rate_until_max_hp,
                        setter: (val) => {
                            cfg.special_units.dragon.hp_increase_rate_until_max_hp = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_feudalism_su_dragon_hp_recovery"),
                        description: t("lobby:cfg_feudalism_su_dragon_hp_recovery_desc"),
                        value: cfg.special_units.dragon.hp_recovery_on_walled_territory,
                        setter: (val) => {
                            cfg.special_units.dragon.hp_recovery_on_walled_territory = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_abilities")} - ${t("lobby:cfg_feudalism_sa_wall")}`}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_feudalism_sa_wall_max"),
                        description: t("lobby:cfg_feudalism_sa_wall_max_desc"),
                        value: cfg.special_abilities.wall.max_walled_countries,
                        setter: (val) => {
                            cfg.special_abilities.wall.max_walled_countries = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_feudalism_sa_wall_rolls_to_break"),
                        description: t("lobby:cfg_feudalism_sa_wall_rolls_to_break_desc"),
                        value: cfg.special_abilities.wall.number_of_max_rolls_to_break,
                        setter: (val) => {
                            cfg.special_abilities.wall.number_of_max_rolls_to_break = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>

                </TableBody>
            </Table>
        </Box>
    ) : <></>;
}

export default LobbyAdminConfigScreenFeudalism;