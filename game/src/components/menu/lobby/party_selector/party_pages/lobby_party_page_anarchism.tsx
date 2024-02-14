import { Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import AnarchismIcon from "../../../../../images/icons/anarchism/anarchism_icon";
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../../../hooks/use_game_session";
import { TSXUtils } from "../../../../../utils/tsx_utils";
import LobbyAdminConfigTitle from "../../admin/config_pages/components/lobby_admin_cfg_title";
import { Fragment } from "react";
import PowerVoidIcon from "../../../../../images/icons/anarchism/power_void_icon";
import OffensiveManiacIcon from "../../../../../images/icons/anarchism/offensive_maniac_icon";
import SpontaneousSpawnIcon from "../../../../../images/icons/anarchism/spontaneous_spawn_ison";
import FrenzyIcon from "../../../../../images/icons/anarchism/frenzy_icon";
import FearsomeEnemyIcon from "../../../../../images/icons/anarchism/fearsome_enemy_icon";

const LobbyPartyPageAnarchism = () => {

    const { t } = useTranslation(["lobby", "parties"]);
    const { currentLobbyState } = useGameSession();
    if (!currentLobbyState) return <></>;
    const cfg = currentLobbyState.game_config.party_config.anarchism;

    return (
        <Box width="100%" height="100%">
            <AnarchismIcon color="primary"/>
            <Typography>{ t("parties:anarchism") }</Typography>

            <Table width="100%"> 
                <TableBody>

                    <LobbyAdminConfigTitle title={t("lobby:passive")}/>

                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <PowerVoidIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:anarchism_pa_empty_territories")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { TSXUtils.replaceWithElement(
                                    t("parties:anarchism_pa_empty_territories_desc"), 
                                    {
                                        toReplace: "<PER_TURN>", 
                                        value: (<Typography color="secondary" display="inline" component="span" key={0}>{ cfg.passive.unoccupied_country_conversion_base }</Typography>)
                                    }
                                )}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <OffensiveManiacIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:anarchism_pa_dice_tie")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { t("parties:anarchism_pa_dice_tie_desc")}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    
                    <LobbyAdminConfigTitle title={t("lobby:bonus")}/>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <SpontaneousSpawnIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:anarchism_bn_troop")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { TSXUtils.replaceWithElement(
                                    t("parties:anarchism_bn_troop_desc"), 
                                    {
                                        toReplace: "<TROOPS>",
                                        value: (<Typography color="secondary" display="inline" component="span" key={0}>{ cfg.bonus.troops_each_turns_end }</Typography>)
                                    }
                                )}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <FrenzyIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:anarchism_bn_attack_stack")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { TSXUtils.replaceWithElement(
                                    t("parties:anarchism_bn_attack_stack_desc"), 
                                    {
                                        toReplace: "<BONUS>",
                                        value: (<Typography color="secondary" display="inline" component="span" key={0}>{ cfg.bonus.attack_success_bonus }</Typography>)
                                    },
                                    {
                                        toReplace: "<STACK>",
                                        value: (<Typography color="secondary" display="inline" component="span" key={1}>{ cfg.bonus.attack_success_bonus_max_stack }</Typography>)
                                    },
                                    {
                                        toReplace: "<TOTAL>",
                                        value: (<Typography color="secondary" display="inline" component="span" key={2}>{ cfg.bonus.attack_success_bonus * cfg.bonus.attack_success_bonus_max_stack }</Typography>)
                                    }
                                ).map( (frag, i) => <Fragment key={i}>{frag}</Fragment>)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                <FearsomeEnemyIcon sx={{ verticalAlign: 'middle' }}/>
                                { t("parties:anarchism_bn_pressure")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                { TSXUtils.replaceWithElement(
                                    t("parties:anarchism_bn_pressure_desc"), 
                                    {
                                        toReplace: "<ATTACKS>",
                                        value: (<Typography color="secondary" display="inline" component="span" key={0}>{ cfg.bonus.number_of_successful_attacks_to_pressure }</Typography>)
                                    }
                                )}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t("lobby:debuff")}/>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">
                                { t("parties:anarchism_db_attack")}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{ t("parties:anarchism_db_attack_desc") }</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">{ t("parties:anarchism_db_un_ban")}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{ t("parties:anarchism_db_un_ban_desc") }</Typography>
                        </TableCell>
                    </TableRow>
                    
                </TableBody>
            </Table>
        </Box>
    );
};

export default LobbyPartyPageAnarchism;
