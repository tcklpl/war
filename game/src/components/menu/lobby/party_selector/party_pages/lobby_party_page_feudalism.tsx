import { Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../../../hooks/use_game_session";
import { TSXUtils } from "../../../../../utils/tsx_utils";
import LobbyAdminConfigTitle from "../../admin/config_pages/components/lobby_admin_cfg_title";
import PowerVoidIcon from "../../../../../images/icons/anarchism/power_void_icon";
import SpontaneousSpawnIcon from "../../../../../images/icons/anarchism/spontaneous_spawn_ison";
import BlackBlockIcon from "../../../../../images/icons/anarchism/black_block_icon";

const LobbyPartyPageFeudalism = () => {

    const { t } = useTranslation(["lobby", "parties", "common", "countries"]);
    const { currentLobbyState } = useGameSession();
    if (!currentLobbyState) return <></>;
    const cfg = currentLobbyState.game_config.party_config.feudalism;

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
            <Table width="100%"> 
                <TableBody>

                    <LobbyAdminConfigTitle title={t("lobby:passive")}/>

                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <PowerVoidIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:feudalism_pa_defense")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { t("parties:feudalism_pa_defense_desc") }
                            </Typography>
                        </TableCell>
                    </TableRow>
                    
                    <LobbyAdminConfigTitle title={t("lobby:bonus")}/>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <SpontaneousSpawnIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:feudalism_bn_troop_gain")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { TSXUtils.replaceWithElement(
                                    t("parties:feudalism_bn_troop_gain_desc"), 
                                    {
                                        toReplace: "<TROOPS>",
                                        value: (<Typography color="secondary" display="inline" component="span" key={0}>{ cfg.bonus.troop_bonus_on_conquering }</Typography>)
                                    }
                                )}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t("lobby:debuff")}/>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                { t("parties:feudalism_db_one_attack")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{ t("parties:feudalism_db_one_attack_desc") }</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Typography variant="h5" padding="16px" textAlign="center">{ t("lobby:special_units") }</Typography>
            <Box display="flex">
                <Box display="flex" justifyItems="center" alignItems="center" marginRight="1em">
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important'}}/>
                </Box>
                <Box flex="1 1 auto">
                    <Table width="100%">
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant="h5">{ t("parties:feudalism_su_dragon") }</Typography>
                                    <Typography variant="body1">
                                        { TSXUtils.replaceWithElement(t("parties:feudalism_su_dragon_desc" ), {
                                            toReplace: '<HP>',
                                            value: (<Typography component="span" color="secondary" key={0}>{ cfg.special_units.dragon.hp }</Typography>)
                                        },{
                                            toReplace: '<INCREMENT>',
                                            value: (<Typography component="span" color="secondary" key={1}>{ cfg.special_units.dragon.hp_increase_rate_until_max_hp }</Typography>)
                                        },{
                                            toReplace: '<MAX_HP>',
                                            value: (<Typography component="span" color="secondary" key={2}>{ cfg.special_units.dragon.max_hp }</Typography>)
                                        },{
                                            toReplace: '<REG_HP>',
                                            value: (<Typography component="span" color="secondary" key={3}>{ cfg.special_units.dragon.hp_recovery_on_walled_territory }</Typography>)
                                        })}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography>{ t("common:hp" )}</Typography></TableCell>
                                <TableCell><Typography color="secondary">{ cfg.special_units.dragon.hp }</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography>{ t("common:max_hp" )}</Typography></TableCell>
                                <TableCell><Typography color="secondary">{ cfg.special_units.dragon.max_hp }</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography>{ t("lobby:spawn_condition" )}</Typography></TableCell>
                                <TableCell><Typography>
                                    { TSXUtils.replaceWithElement(t("parties:feudalism_su_dragon_spawn" ), {
                                        toReplace: '<TURNS>',
                                        value: (<Typography component="span" color="secondary" key={0}>{ cfg.special_units.dragon.cooldown_after_dying }</Typography>)
                                    }) }
                                </Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography>{ t("lobby:spawn_location" )}</Typography></TableCell>
                                <TableCell><Typography>{ t("countries:france" ) }</Typography></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
};

export default LobbyPartyPageFeudalism;
