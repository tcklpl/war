import { Box, Table, TableBody } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useGameSession } from "../../../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";
import LobbyAdminConfigOption from "./components/lobby_admin_cfg_option";
import LobbyAdminConfigGroupHp from "./components/lobby_admin_cfg_group_hp";
import LobbyAdminConfigTitle from "./components/lobby_admin_cfg_title";


const LobbyAdminConfigScreenSocialism: React.FC = () => {

    const { currentLobbyState, modifyLobbyState } = useGameSession();
    const { t } = useTranslation(["common", "lobby"]);

    const [cfg, setCfg] = useState(currentLobbyState?.game_config.party_config.socialism);
    useEffect(() => {
        if (!cfg) return;
        modifyLobbyState(s => {
            s.game_config.party_config.socialism = cfg;
            return s;
        });
    }, [cfg, modifyLobbyState]);

    if (!cfg) return <></>;

    return currentLobbyState ? (
        <Box width="100%" height="100%">
            <Table width="100%">
                <TableBody>

                    <LobbyAdminConfigTitle title={ t("lobby:passive") }/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_passive_min_troops"),
                        description: t("lobby:cfg_socialism_passive_min_troops_desc"),
                        value: cfg.passive.min_troop_movement_size_to_allow_unlimited_movement,
                        setter: (val) => {
                            cfg.passive.min_troop_movement_size_to_allow_unlimited_movement = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={ t("lobby:bonus") }/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_bonus_dice_advantage"),
                        description: t("lobby:cfg_socialism_bonus_dice_advantage_desc"),
                        value: cfg.bonus.dice_modifier_on_numerical_disadvantage,
                        setter: (val) => {
                            cfg.bonus.dice_modifier_on_numerical_disadvantage = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={ t("lobby:debuff") }/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_debuff_famine_start"),
                        description: t("lobby:cfg_socialism_debuff_famine_start_desc"),
                        value: cfg.debuffs.famine_starting_point,
                        setter: (val) => {
                            cfg.debuffs.famine_starting_point = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_debuff_famine_units"),
                        description: t("lobby:cfg_socialism_debuff_famine_units_desc"),
                        value: cfg.debuffs.famine_units_to_die_per_turn,
                        setter: (val) => {
                            cfg.debuffs.famine_units_to_die_per_turn = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_socialism_su_lula")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.lula.hp} maxHp={cfg.special_units.lula.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.lula.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.lula.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_socialism_su_lenin")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.vladimir_lenin.hp} maxHp={cfg.special_units.vladimir_lenin.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.vladimir_lenin.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.vladimir_lenin.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_socialism_su_stalin")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.joseph_stalin.hp} maxHp={cfg.special_units.joseph_stalin.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.joseph_stalin.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.joseph_stalin.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_su_stalin_gulag_rate"),
                        description: t("lobby:cfg_socialism_su_stalin_gulag_rate_desc"),
                        value: cfg.special_units.joseph_stalin.gulag_troop_conversion_rate,
                        setter: (val) => {
                            cfg.special_units.joseph_stalin.gulag_troop_conversion_rate = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_socialism_su_morus")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.thomas_morus.hp} maxHp={cfg.special_units.thomas_morus.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.thomas_morus.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.thomas_morus.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_su_morus_turns_island"),
                        description: t("lobby:cfg_socialism_su_morus_turns_island_desc"),
                        value: cfg.special_units.thomas_morus.turns_in_cuba_to_spawn_utopia_island,
                        setter: (val) => {
                            cfg.special_units.thomas_morus.turns_in_cuba_to_spawn_utopia_island = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_socialism_su_wilson")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.wilson.hp} maxHp={cfg.special_units.wilson.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.wilson.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.wilson.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_su_wilson_seq_length"),
                        description: t("lobby:cfg_socialism_su_wilson_seq_length_desc"),
                        value: cfg.special_units.wilson.required_numerical_roll_sequence_length,
                        setter: (val) => {
                            cfg.special_units.wilson.required_numerical_roll_sequence_length = val;
                            setCfg({...cfg});
                        },
                        min: 1,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_units")} - ${t("lobby:cfg_socialism_su_red_god")}`}/>
                    <LobbyAdminConfigGroupHp hp={cfg.special_units.red_god.hp} maxHp={cfg.special_units.red_god.max_hp}
                        setHp={(hp) => {
                            cfg.special_units.red_god.hp = hp;
                            setCfg({...cfg});
                        }}
                        setMaxHp={(hp) => {
                            cfg.special_units.red_god.max_hp = hp;
                            setCfg({...cfg});
                        }}
                    />
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_su_red_god_bonus"),
                        description: t("lobby:cfg_socialism_su_red_god_bonus_desc"),
                        value: cfg.special_units.red_god.dice_bonus,
                        setter: (val) => {
                            cfg.special_units.red_god.dice_bonus = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_abilities")} - ${t("lobby:cfg_socialism_sa_tsar")}`}/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_sa_tsar_cast"),
                        description: t("lobby:cfg_socialism_sa_tsar_cast_desc"),
                        value: cfg.special_abilities.tsar_bomb.turns_to_cast,
                        setter: (val) => {
                            cfg.special_abilities.tsar_bomb.turns_to_cast = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_sa_tsar_famine"),
                        description: t("lobby:cfg_socialism_sa_tsar_famine_desc"),
                        value: cfg.special_abilities.tsar_bomb.famine_multiplier_while_casting,
                        setter: (val) => {
                            cfg.special_abilities.tsar_bomb.famine_multiplier_while_casting = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_sa_tsar_radiation"),
                        description: t("lobby:cfg_socialism_sa_tsar_radiation_desc"),
                        value: cfg.special_abilities.tsar_bomb.radiation_falloff_turns,
                        setter: (val) => {
                            cfg.special_abilities.tsar_bomb.radiation_falloff_turns = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>

                    <LobbyAdminConfigTitle title={`${t("lobby:special_abilities")} - ${t("lobby:cfg_socialism_sa_utopia_island")}`}/>
                    <LobbyAdminConfigOption options={{
                        type: 'number',
                        name: t("lobby:cfg_socialism_sa_utopia_island_troops"),
                        description: t("lobby:cfg_socialism_sa_utopia_island_troops_desc"),
                        value: cfg.special_abilities.utopia_island.troops_per_turn,
                        setter: (val) => {
                            cfg.special_abilities.utopia_island.troops_per_turn = val;
                            setCfg({...cfg});
                        },
                        min: 0,
                        max: 99
                    }}/>

                </TableBody>
            </Table>
        </Box>
    ) : <></>;
}

export default LobbyAdminConfigScreenSocialism;