import { useGameSession } from ':hooks/use_game_session';
import BlackBlockIcon from ':icons/anarchism/black_block_icon';
import FearsomeEnemyIcon from ':icons/anarchism/fearsome_enemy_icon';
import FrenzyIcon from ':icons/anarchism/frenzy_icon';
import OffensiveManiacIcon from ':icons/anarchism/offensive_maniac_icon';
import PowerVoidIcon from ':icons/anarchism/power_void_icon';
import SpontaneousSpawnIcon from ':icons/anarchism/spontaneous_spawn_icon';
import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { TSXUtils } from '../../../../../utils/tsx_utils';
import LobbyAdminConfigTitle from '../../admin/config_pages/components/lobby_admin_cfg_title';

const LobbyPartyPageAnarchism = () => {
    const { t } = useTranslation(['lobby', 'parties', 'common']);
    const { currentLobbyState } = useGameSession();
    if (!currentLobbyState) return <></>;
    const cfg = currentLobbyState.game_config.party_config.anarchism;

    return (
        <Box width='100%' height='100%' display='flex' flexDirection='column'>
            <Table width='100%'>
                <TableBody>
                    <LobbyAdminConfigTitle title={t('lobby:passive')} />

                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>
                                <PowerVoidIcon sx={{ verticalAlign: 'middle' }} />
                                {t('parties:anarchism_pa_empty_territories')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(t('parties:anarchism_pa_empty_territories_desc'), {
                                    toReplace: '<PER_TURN>',
                                    value: k => (
                                        <Typography color='secondary' display='inline' component='span' key={k}>
                                            {cfg.passive.unoccupied_country_conversion_base}
                                        </Typography>
                                    ),
                                })}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>
                                <OffensiveManiacIcon sx={{ verticalAlign: 'middle' }} />
                                {t('parties:anarchism_pa_dice_tie')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{t('parties:anarchism_pa_dice_tie_desc')}</Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t('lobby:bonus')} />
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>
                                <SpontaneousSpawnIcon sx={{ verticalAlign: 'middle' }} />
                                {t('parties:anarchism_bn_troop')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(t('parties:anarchism_bn_troop_desc'), {
                                    toReplace: '<TROOPS>',
                                    value: k => (
                                        <Typography color='secondary' display='inline' component='span' key={k}>
                                            {cfg.bonus.troops_each_turns_end}
                                        </Typography>
                                    ),
                                })}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>
                                <FrenzyIcon sx={{ verticalAlign: 'middle' }} />
                                {t('parties:anarchism_bn_attack_stack')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(
                                    t('parties:anarchism_bn_attack_stack_desc'),
                                    {
                                        toReplace: '<BONUS>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.bonus.attack_success_bonus}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<STACK>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.bonus.attack_success_bonus_max_stack}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<TOTAL>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.bonus.attack_success_bonus *
                                                    cfg.bonus.attack_success_bonus_max_stack}
                                            </Typography>
                                        ),
                                    },
                                ).map((frag, i) => (
                                    <Fragment key={i}>{frag}</Fragment>
                                ))}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>
                                <FearsomeEnemyIcon sx={{ verticalAlign: 'middle' }} />
                                {t('parties:anarchism_bn_pressure')}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(t('parties:anarchism_bn_pressure_desc'), {
                                    toReplace: '<ATTACKS>',
                                    value: k => (
                                        <Typography color='secondary' display='inline' component='span' key={k}>
                                            {cfg.bonus.number_of_successful_attacks_to_pressure}
                                        </Typography>
                                    ),
                                })}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t('lobby:debuff')} />
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:anarchism_db_attack')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{t('parties:anarchism_db_attack_desc')}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:anarchism_db_un_ban')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{t('parties:anarchism_db_un_ban_desc')}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Typography variant='h5' padding='16px' textAlign='center'>
                {t('lobby:special_units')}
            </Typography>
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:anarchism_su_black_block')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(t('parties:anarchism_su_black_block_desc'), {
                                            toReplace: '<HP>',
                                            value: k => (
                                                <Typography component='span' color='secondary' key={k}>
                                                    {cfg.special_units.black_block.hp_recovery_on_successful_attack}
                                                </Typography>
                                            ),
                                        })}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.black_block.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.black_block.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:anarchism_su_black_block_spawn_condition'),
                                            {
                                                toReplace: '<TERRITORIES>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {
                                                            cfg.special_units.black_block
                                                                .number_of_lost_territories_required_to_spawn
                                                        }
                                                    </Typography>
                                                ),
                                            },
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:anarchism_su_black_block_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
};

export default LobbyPartyPageAnarchism;
