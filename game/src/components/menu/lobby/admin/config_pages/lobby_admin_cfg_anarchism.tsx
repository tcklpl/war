import { Box, Table, TableBody } from "@mui/material";
import { useEffect, useState } from "react"
import { useGameSession } from "../../../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";
import LobbyAdminConfigOption from "./components/lobby_admin_cfg_option";
import LobbyAdminConfigGroupHp from "./components/lobby_admin_cfg_group_hp";
import LobbyAdminConfigTitle from "./components/lobby_admin_cfg_title";


const LobbyAdminConfigScreenAnarchism = ({ disabled }: { disabled: boolean }) => {

    const { currentLobbyState, modifyLobbyState } = useGameSession();
    const { t } = useTranslation(["common", "lobby"]);

    const [cfg, setCfg] = useState(currentLobbyState?.game_config.party_config.anarchism);
    useEffect(() => {
        if (!cfg) return;
        modifyLobbyState(s => {
            s.game_config.party_config.anarchism = cfg;
            return s;
        });
    }, [cfg, modifyLobbyState]);

    if (!cfg) return <></>;

    return currentLobbyState ? (
        <Box width="100%" height="100%">
            <Table width="100%">
                <TableBody>

                    <LobbyAdminConfigTitle title={t("lobby:passive")}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_passive_unoccupied_country_conversion_base"),
                        description: t("lobby:cfg_anarchism_passive_unoccupied_country_conversion_base_desc"),
                        value: cfg.passive.unoccupied_country_conversion_base,
                        setter: (val) => {
                            cfg.passive.unoccupied_country_conversion_base = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 10,
                        disabled: disabled
                    }}/>

                    <LobbyAdminConfigTitle title={t("lobby:bonus")}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_bonus_troops_each_turns_end"),
                        description: t("lobby:cfg_anarchism_bonus_troops_each_turns_end_desc"),
                        value: cfg.bonus.troops_each_turns_end,
                        setter: (val) => {
                            cfg.bonus.troops_each_turns_end = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99,
                        disabled: disabled
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_bonus_attack_success_bonus"),
                        description: t("lobby:cfg_anarchism_bonus_attack_success_bonus_desc"),
                        value: cfg.bonus.attack_success_bonus,
                        setter: (val) => {
                            cfg.bonus.attack_success_bonus = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99,
                        disabled: disabled
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_bonus_attack_success_bonus_max_stack"),
                        description: t("lobby:cfg_anarchism_bonus_attack_success_bonus_max_stack_desc"),
                        value: cfg.bonus.attack_success_bonus_max_stack,
                        setter: (val) => {
                            cfg.bonus.attack_success_bonus_max_stack = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99,
                        disabled: disabled
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_bonus_number_of_successful_attacks_to_pressure"),
                        description: t("lobby:cfg_anarchism_bonus_number_of_successful_attacks_to_pressure_desc"),
                        value: cfg.bonus.number_of_successful_attacks_to_pressure,
                        setter: (val) => {
                            cfg.bonus.number_of_successful_attacks_to_pressure = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99,
                        disabled: disabled
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_anarchism_su_black_block")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.black_block.hp} maxHp={cfg.special_units.black_block.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.black_block.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.black_block.max_hp = hp;
                            setCfg({...cfg});
                        }}
                        disabled={disabled}
                    />
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_su_black_block_number_of_lost_territories_required_to_spawn"),
                        description: t("lobby:cfg_anarchism_su_black_block_number_of_lost_territories_required_to_spawn_desc"),
                        value: cfg.special_units.black_block.number_of_lost_territories_required_to_spawn,
                        setter: (val) => {
                            cfg.special_units.black_block.number_of_lost_territories_required_to_spawn = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99,
                        disabled: disabled
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: "number",
                        name: t("lobby:cfg_anarchism_su_black_block_hp_recovery_on_successful_attack"),
                        description: t("lobby:cfg_anarchism_su_black_block_hp_recovery_on_successful_attack_desc"),
                        value: cfg.special_units.black_block.hp_recovery_on_successful_attack,
                        setter: (val) => {
                            cfg.special_units.black_block.hp_recovery_on_successful_attack = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99,
                        disabled: disabled
                    }}/>
                </TableBody>
            </Table>
        </Box>
    ) : <></>;
}

export default LobbyAdminConfigScreenAnarchism;