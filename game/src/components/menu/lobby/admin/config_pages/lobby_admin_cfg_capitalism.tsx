import { Box, Table, TableBody } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGameSession } from '../../../../../hooks/use_game_session';
import { useTranslation } from 'react-i18next';
import LobbyAdminConfigTitle from './components/lobby_admin_cfg_title';
import LobbyAdminConfigOption from './components/lobby_admin_cfg_option';
import LobbyAdminConfigGroupHp from './components/lobby_admin_cfg_group_hp';

const LobbyAdminConfigScreenCapitalism = ({ disabled }: { disabled: boolean }) => {
    const { currentLobbyState, modifyLobbyState, cloneLobbyState } = useGameSession();
    const { t } = useTranslation(['common', 'lobby']);

    const [cfg, setCfg] = useState(cloneLobbyState()?.game_config.party_config.capitalism);
    useEffect(() => {
        if (!cfg) return;
        modifyLobbyState(s => {
            s.game_config.party_config.capitalism = cfg;
            return s;
        });
    }, [cfg, modifyLobbyState]);

    if (!cfg) return <></>;

    return currentLobbyState ? (
        <Box width='100%' height='100%'>
            <Table width='100%'>
                <TableBody>
                    <LobbyAdminConfigTitle title={t('lobby:passive')} />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_pa_troop_gain'),
                            description: t('lobby:cfg_capitalism_pa_troop_gain_desc'),
                            value: cfg.passive.troop_gain_per_territory_trade,
                            setter: val => {
                                cfg.passive.troop_gain_per_territory_trade = val;
                                setCfg({ ...cfg });
                            },
                            min: 0,
                            max: 10,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle title={t('lobby:bonus')} />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_bn_continental_multiplier'),
                            description: t('lobby:cfg_capitalism_bn_continental_multiplier_desc'),
                            value: cfg.bonus.continental_bonus_multiplier,
                            setter: val => {
                                cfg.bonus.continental_bonus_multiplier = val;
                                setCfg({ ...cfg });
                            },
                            min: 0,
                            max: 10,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle title={t('lobby:debuff')} />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_db_crisis_seq'),
                            description: t('lobby:cfg_capitalism_db_crisis_seq_desc'),
                            value: cfg.debuffs.crisis_sequential_loses,
                            setter: val => {
                                cfg.debuffs.crisis_sequential_loses = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_db_crisis_duration'),
                            description: t('lobby:cfg_capitalism_db_crisis_duration_desc'),
                            value: cfg.debuffs.crisis_duration,
                            setter: val => {
                                cfg.debuffs.crisis_duration = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle
                        title={`${t('lobby:special_units')} - ${t('lobby:cfg_capitalism_su_keynes')}`}
                    />
                    <LobbyAdminConfigGroupHp
                        hp={cfg.special_units.john_keynes.hp}
                        maxHp={cfg.special_units.john_keynes.max_hp}
                        setHp={hp => {
                            cfg.special_units.john_keynes.hp = hp;
                            setCfg({ ...cfg });
                        }}
                        setMaxHp={hp => {
                            cfg.special_units.john_keynes.max_hp = hp;
                            setCfg({ ...cfg });
                        }}
                        disabled={disabled}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_keynes_multiplier'),
                            description: t('lobby:cfg_capitalism_su_keynes_multiplier_desc'),
                            value: cfg.special_units.john_keynes.troop_multiplier,
                            setter: val => {
                                cfg.special_units.john_keynes.troop_multiplier = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_keynes_cooldown'),
                            description: t('lobby:cfg_capitalism_su_keynes_cooldown_desc'),
                            value: cfg.special_units.john_keynes.troop_multiplication_cooldown,
                            setter: val => {
                                cfg.special_units.john_keynes.troop_multiplication_cooldown = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle
                        title={`${t('lobby:special_units')} - ${t('lobby:cfg_capitalism_su_croc')}`}
                    />
                    <LobbyAdminConfigGroupHp
                        hp={cfg.special_units.ray_croc.hp}
                        maxHp={cfg.special_units.ray_croc.max_hp}
                        setHp={hp => {
                            cfg.special_units.ray_croc.hp = hp;
                            setCfg({ ...cfg });
                        }}
                        setMaxHp={hp => {
                            cfg.special_units.ray_croc.max_hp = hp;
                            setCfg({ ...cfg });
                        }}
                        disabled={disabled}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_croc_cooldown'),
                            description: t('lobby:cfg_capitalism_su_croc_cooldown_desc'),
                            value: cfg.special_units.ray_croc.force_country_buy_cooldown,
                            setter: val => {
                                cfg.special_units.ray_croc.force_country_buy_cooldown = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle
                        title={`${t('lobby:special_units')} - ${t('lobby:cfg_capitalism_su_zuck')}`}
                    />
                    <LobbyAdminConfigGroupHp
                        hp={cfg.special_units.mark_zuckerberg.hp}
                        maxHp={cfg.special_units.mark_zuckerberg.max_hp}
                        setHp={hp => {
                            cfg.special_units.mark_zuckerberg.hp = hp;
                            setCfg({ ...cfg });
                        }}
                        setMaxHp={hp => {
                            cfg.special_units.mark_zuckerberg.max_hp = hp;
                            setCfg({ ...cfg });
                        }}
                        disabled={disabled}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_zuck_rate'),
                            description: t('lobby:cfg_capitalism_su_zuck_rate_desc'),
                            value: cfg.special_units.mark_zuckerberg.social_network_troop_conversion_rate,
                            setter: val => {
                                cfg.special_units.mark_zuckerberg.social_network_troop_conversion_rate = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_zuck_cooldown'),
                            description: t('lobby:cfg_capitalism_su_zuck_cooldown'),
                            value: cfg.special_units.mark_zuckerberg.create_social_network_cooldown,
                            setter: val => {
                                cfg.special_units.mark_zuckerberg.create_social_network_cooldown = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle
                        title={`${t('lobby:special_units')} - ${t('lobby:cfg_capitalism_su_jobs')}`}
                    />
                    <LobbyAdminConfigGroupHp
                        hp={cfg.special_units.steve_jobs.hp}
                        maxHp={cfg.special_units.steve_jobs.max_hp}
                        setHp={hp => {
                            cfg.special_units.steve_jobs.hp = hp;
                            setCfg({ ...cfg });
                        }}
                        setMaxHp={hp => {
                            cfg.special_units.steve_jobs.max_hp = hp;
                            setCfg({ ...cfg });
                        }}
                        disabled={disabled}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_jobs_rate'),
                            description: t('lobby:cfg_capitalism_su_jobs_rate_desc'),
                            value: cfg.special_units.steve_jobs.troop_invalidation_rate,
                            setter: val => {
                                cfg.special_units.steve_jobs.troop_invalidation_rate = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_jobs_cooldown'),
                            description: t('lobby:cfg_capitalism_su_jobs_cooldown_desc'),
                            value: cfg.special_units.steve_jobs.create_store_cooldown,
                            setter: val => {
                                cfg.special_units.steve_jobs.create_store_cooldown = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle
                        title={`${t('lobby:special_units')} - ${t('lobby:cfg_capitalism_su_trump')}`}
                    />
                    <LobbyAdminConfigGroupHp
                        hp={cfg.special_units.donald_trump.hp}
                        maxHp={cfg.special_units.donald_trump.max_hp}
                        setHp={hp => {
                            cfg.special_units.donald_trump.hp = hp;
                            setCfg({ ...cfg });
                        }}
                        setMaxHp={hp => {
                            cfg.special_units.donald_trump.max_hp = hp;
                            setCfg({ ...cfg });
                        }}
                        disabled={disabled}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_su_trump_bonus'),
                            description: t('lobby:cfg_capitalism_su_trump_bonus_desc'),
                            value: cfg.special_units.donald_trump.territory_defense_modifier,
                            setter: val => {
                                cfg.special_units.donald_trump.territory_defense_modifier = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />

                    <LobbyAdminConfigTitle
                        title={`${t('lobby:special_abilities')} - ${t('lobby:cfg_capitalism_sa_privatization')}`}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'number',
                            name: t('lobby:cfg_capitalism_sa_privatization_cooldown'),
                            description: t('lobby:cfg_capitalism_sa_privatization_cooldown_desc'),
                            value: cfg.special_abilities.privatization.cooldown,
                            setter: val => {
                                cfg.special_abilities.privatization.cooldown = val;
                                setCfg({ ...cfg });
                            },
                            min: 1,
                            max: 99,
                            disabled: disabled,
                        }}
                    />
                    <LobbyAdminConfigOption
                        options={{
                            type: 'boolean',
                            name: t('lobby:cfg_capitalism_sa_privatization_allow_specials'),
                            description: t('lobby:cfg_capitalism_sa_privatization_allow_specials_desc'),
                            value: cfg.special_abilities.privatization.allow_using_specials,
                            setter: val => {
                                cfg.special_abilities.privatization.allow_using_specials = val;
                                setCfg({ ...cfg });
                            },
                            disabled: disabled,
                        }}
                    />
                </TableBody>
            </Table>
        </Box>
    ) : (
        <></>
    );
};

export default LobbyAdminConfigScreenCapitalism;
