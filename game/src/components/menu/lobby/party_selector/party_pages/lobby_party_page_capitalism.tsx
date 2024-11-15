import { useGameSession } from ':hooks/use_game_session';
import BlackBlockIcon from ':icons/anarchism/black_block_icon';
import { Alert, AlertTitle, Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TSXUtils } from '../../../../../utils/tsx_utils';
import LobbyAdminConfigTitle from '../../admin/config_pages/components/lobby_admin_cfg_title';

const LobbyPartyPageCapitalism = () => {
    const { t } = useTranslation(['lobby', 'parties', 'common', 'countries']);
    const { currentLobbyState } = useGameSession();
    if (!currentLobbyState) return <></>;
    const cfg = currentLobbyState.game_config.party_config.capitalism;

    return (
        <Box width='100%' height='100%' display='flex' flexDirection='column'>
            <Table width='100%'>
                <TableBody>
                    <LobbyAdminConfigTitle title={t('lobby:passive')} />

                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:capitalism_pa_trade')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(t('parties:capitalism_pa_trade_desc'), {
                                    toReplace: '<TROOPS>',
                                    value: k => (
                                        <Typography color='secondary' display='inline' component='span' key={k}>
                                            {cfg.passive.troop_gain_per_territory_trade}
                                        </Typography>
                                    ),
                                })}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t('lobby:bonus')} />
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:capitalism_bn_continental')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{t('parties:capitalism_bn_continental_desc')}</Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t('lobby:debuff')} />
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:capitalism_db_crisis')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(
                                    t('parties:capitalism_db_crisis_desc'),
                                    {
                                        toReplace: '<BATTLES>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.debuffs.crisis_sequential_loses}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<CRISIS>',
                                        value: k => (
                                            <Typography color='primary' display='inline' component='span' key={k}>
                                                {t('parties:capitalism_db_crisis')}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<TURN>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.debuffs.crisis_duration}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<PRIVATIZATION>',
                                        value: k => (
                                            <Typography color='primary' display='inline' component='span' key={k}>
                                                {t('parties:capitalism_sa_privatization')}
                                            </Typography>
                                        ),
                                    },
                                )}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Typography variant='h5' padding='16px' textAlign='center'>
                {t('lobby:special_units')}
            </Typography>
            <Alert variant='outlined' severity='info'>
                <AlertTitle>{t('parties:capitalism_su_spawn_condition')}</AlertTitle>
                {t('parties:capitalism_su_spawn_condition_desc')}
            </Alert>

            {/* Keynes */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:capitalism_su_keynes')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:capitalism_su_keynes_desc'),
                                            {
                                                toReplace: '<FACTOR>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {cfg.special_units.john_keynes.troop_multiplier}
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<TURNS>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {cfg.special_units.john_keynes.troop_multiplication_cooldown}
                                                    </Typography>
                                                ),
                                            },
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.john_keynes.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.john_keynes.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Croc */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:capitalism_su_croc')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:capitalism_su_croc_desc'),
                                            {
                                                toReplace: '<TURNS>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {cfg.special_units.ray_croc.force_country_buy_cooldown}
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<SOCIALISM>',
                                                value: k => (
                                                    <Typography component='span' color='primary' key={k}>
                                                        {t('parties:socialism')}
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<UTOPIA_ISLAND>',
                                                value: k => (
                                                    <Typography component='span' color='primary' key={k}>
                                                        {t('parties:socialism_sa_utopia_island')}
                                                    </Typography>
                                                ),
                                            },
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.ray_croc.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.ray_croc.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Zuckerberg */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:capitalism_su_zuckerberg')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:capitalism_su_zuckerberg_desc'),
                                            {
                                                toReplace: '<TROOPS>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {
                                                            cfg.special_units.mark_zuckerberg
                                                                .social_network_troop_conversion_rate
                                                        }
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<TURN>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {
                                                            cfg.special_units.mark_zuckerberg
                                                                .create_social_network_cooldown
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
                                    <Typography>{t('common:hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.mark_zuckerberg.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>
                                        {cfg.special_units.mark_zuckerberg.max_hp}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Jobs */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:capitalism_su_jobs')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:capitalism_su_jobs_desc'),
                                            {
                                                toReplace: '<TROOP>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {cfg.special_units.steve_jobs.troop_invalidation_rate}
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<TURN>',
                                                value: k => (
                                                    <Typography component='span' color='secondary' key={k}>
                                                        {cfg.special_units.steve_jobs.create_store_cooldown}
                                                    </Typography>
                                                ),
                                            },
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.steve_jobs.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.steve_jobs.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Trump */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:capitalism_su_trump')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(t('parties:capitalism_su_trump_desc'), {
                                            toReplace: '<BONUS>',
                                            value: k => (
                                                <Typography component='span' color='secondary' key={k}>
                                                    {cfg.special_units.donald_trump.territory_defense_modifier}
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
                                    <Typography color='secondary'>{cfg.special_units.donald_trump.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.donald_trump.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:capitalism_su_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            <Typography variant='h5' padding='16px' textAlign='center'>
                {t('lobby:special_abilities')}
            </Typography>
            {/* Privatization */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Typography variant='h5'>{t('parties:capitalism_sa_privatization')}</Typography>
                    <Typography variant='body1'>{t('parties:capitalism_sa_privatization_desc')}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default LobbyPartyPageCapitalism;
