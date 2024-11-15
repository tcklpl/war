import { useGameSession } from ':hooks/use_game_session';
import BlackBlockIcon from ':icons/anarchism/black_block_icon';
import {
    Alert,
    AlertTitle,
    Box,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TSXUtils } from '../../../../../utils/tsx_utils';
import LobbyAdminConfigTitle from '../../admin/config_pages/components/lobby_admin_cfg_title';

const LobbyPartyPageSocialism = () => {
    const { t } = useTranslation(['lobby', 'parties', 'common', 'countries']);
    const { currentLobbyState } = useGameSession();
    if (!currentLobbyState) return <></>;
    const cfg = currentLobbyState.game_config.party_config.socialism;

    return (
        <Box width='100%' height='100%' display='flex' flexDirection='column'>
            <Table width='100%'>
                <TableBody>
                    <LobbyAdminConfigTitle title={t('lobby:passive')} />

                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:socialism_pa_movement')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(t('parties:socialism_pa_movement_desc'), {
                                    toReplace: '<TROOPS>',
                                    value: k => (
                                        <Typography color='secondary' display='inline' component='span' key={k}>
                                            {cfg.passive.min_troop_movement_size_to_allow_unlimited_movement}
                                        </Typography>
                                    ),
                                })}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t('lobby:bonus')} />
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:socialism_bn_dice')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(t('parties:socialism_bn_dice_desc'), {
                                    toReplace: '<BONUS>',
                                    value: k => (
                                        <Typography color='secondary' display='inline' component='span' key={k}>
                                            {cfg.bonus.dice_modifier_on_numerical_disadvantage}
                                        </Typography>
                                    ),
                                })}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <LobbyAdminConfigTitle title={t('lobby:debuff')} />
                    <TableRow>
                        <TableCell>
                            <Typography color='primary'>{t('parties:socialism_db_famine')}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                {TSXUtils.replaceWithElement(
                                    t('parties:socialism_db_famine_desc'),
                                    {
                                        toReplace: '<UNIT>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.debuffs.famine_units_to_die_per_turn}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<BATCH1>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.debuffs.famine_starting_point}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        toReplace: '<BATCH2>',
                                        value: k => (
                                            <Typography color='secondary' display='inline' component='span' key={k}>
                                                {cfg.debuffs.famine_starting_point}
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
                <AlertTitle>{t('parties:socialism_su_spawn_condition')}</AlertTitle>
                {t('parties:socialism_su_spawn_condition_desc')}
            </Alert>

            {/* Lula */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:socialism_su_lula')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(t('parties:socialism_su_lula_desc'), {
                                            toReplace: '<FAMINE>',
                                            value: k => (
                                                <Typography component='span' color='primary' key={k}>
                                                    {t('parties:socialism_db_famine')}
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
                                    <Typography color='secondary'>{cfg.special_units.lula.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.lula.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:socialism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('countries:moscow')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Lenin */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:socialism_su_lenin')}</Typography>
                                    <Typography variant='body1'>{t('parties:socialism_su_lenin_desc')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.vladimir_lenin.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.vladimir_lenin.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:socialism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('countries:moscow')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Stalin */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:socialism_su_stalin')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:socialism_su_stalin_desc'),
                                            {
                                                toReplace: '<GULAG1>',
                                                value: k => (
                                                    <Typography
                                                        color='primary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
                                                        {t('parties:socialism_sa_gulag')}
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<GULAG2>',
                                                value: k => (
                                                    <Typography
                                                        color='primary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
                                                        {t('parties:socialism_sa_gulag')}
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
                                    <Typography color='secondary'>{cfg.special_units.joseph_stalin.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.joseph_stalin.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <List>
                                        <ListItem key={0}>{t('parties:socialism_su_spawn_condition')}</ListItem>
                                        <ListItem key={1}>
                                            {t('parties:socialism_su_stalin_spawn_condition_1')}
                                        </ListItem>
                                        <ListItem key={2}>
                                            {TSXUtils.replaceWithElement(
                                                t('parties:socialism_su_stalin_spawn_condition_2'),
                                                {
                                                    toReplace: '<LENIN>',
                                                    value: k => (
                                                        <Typography
                                                            color='primary'
                                                            display='inline'
                                                            component='span'
                                                            key={k}
                                                        >
                                                            {t('parties:socialism_su_lenin')}
                                                        </Typography>
                                                    ),
                                                },
                                            )}
                                        </ListItem>
                                    </List>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('countries:moscow')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Morus */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:socialism_su_morus')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:socialism_su_morus_desc'),
                                            {
                                                toReplace: '<TURNS>',
                                                value: k => (
                                                    <Typography
                                                        color='secondary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
                                                        {
                                                            cfg.special_units.thomas_morus
                                                                .turns_in_cuba_to_spawn_utopia_island
                                                        }
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<UTOPIA_ISLAND>',
                                                value: k => (
                                                    <Typography
                                                        color='primary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
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
                                    <Typography color='secondary'>{cfg.special_units.thomas_morus.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.thomas_morus.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('parties:socialism_su_spawn_condition')}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('countries:moscow')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Wilson */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:socialism_su_wilson')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:socialism_su_wilson_desc'),
                                            {
                                                toReplace: '<LENGTH>',
                                                value: k => (
                                                    <Typography
                                                        color='secondary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
                                                        {
                                                            cfg.special_units.wilson
                                                                .required_numerical_roll_sequence_length
                                                        }
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                toReplace: '<THE_RED_GOD>',
                                                value: k => (
                                                    <Typography
                                                        color='primary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
                                                        {t('parties:socialism_su_red_god')}
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
                                    <Typography color='secondary'>{cfg.special_units.wilson.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.wilson.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <List>
                                        <ListItem key={0}>
                                            <Typography>{t('parties:socialism_su_spawn_condition')}</Typography>
                                        </ListItem>
                                        <ListItem key={1}>
                                            <Typography>
                                                {TSXUtils.replaceWithElement(
                                                    t('parties:socialism_su_wilson_spawn_condition'),
                                                    {
                                                        toReplace: '<THE_RED_GOD>',
                                                        value: k => (
                                                            <Typography
                                                                color='primary'
                                                                display='inline'
                                                                component='span'
                                                                key={k}
                                                            >
                                                                {t('parties:socialism_su_red_god')}
                                                            </Typography>
                                                        ),
                                                    },
                                                    {
                                                        toReplace: '<WILSON>',
                                                        value: k => (
                                                            <Typography
                                                                color='primary'
                                                                display='inline'
                                                                component='span'
                                                                key={k}
                                                            >
                                                                {t('parties:socialism_su_wilson')}
                                                            </Typography>
                                                        ),
                                                    },
                                                )}
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_location')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{t('countries:moscow')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            {/* Red God */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Table width='100%'>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h5'>{t('parties:socialism_su_red_god')}</Typography>
                                    <Typography variant='body1'>
                                        {TSXUtils.replaceWithElement(t('parties:socialism_su_red_god_desc'), {
                                            toReplace: '<BONUS>',
                                            value: k => (
                                                <Typography color='secondary' display='inline' component='span' key={k}>
                                                    {cfg.special_units.red_god.dice_bonus}
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
                                    <Typography color='secondary'>{cfg.special_units.red_god.hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('common:max_hp')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography color='secondary'>{cfg.special_units.red_god.max_hp}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>{t('lobby:spawn_condition')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {TSXUtils.replaceWithElement(
                                            t('parties:socialism_su_red_god_spawn_condition'),
                                            {
                                                toReplace: '<LENGTH>',
                                                value: k => (
                                                    <Typography
                                                        color='secondary'
                                                        display='inline'
                                                        component='span'
                                                        key={k}
                                                    >
                                                        {
                                                            cfg.special_units.wilson
                                                                .required_numerical_roll_sequence_length
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
                                    <Typography>{t('parties:socialism_su_red_god_spawn_location')}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            <Typography variant='h5' padding='16px' textAlign='center'>
                {t('lobby:special_abilities')}
            </Typography>
            {/* Gulag */}
            <Box display='flex'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Typography variant='h5'>{t('parties:socialism_sa_gulag')}</Typography>
                    <Typography variant='body1'>
                        {TSXUtils.replaceWithElement(t('parties:socialism_sa_gulag_desc'), {
                            toReplace: '<RATE>',
                            value: k => (
                                <Typography component='span' color='secondary' key={k}>
                                    {cfg.special_units.joseph_stalin.gulag_troop_conversion_rate}
                                </Typography>
                            ),
                        })}
                    </Typography>
                </Box>
            </Box>

            {/* Tsar Bomb */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Typography variant='h5'>{t('parties:socialism_sa_tsar_bomb')}</Typography>
                    <Typography variant='body1'>
                        {TSXUtils.replaceWithElement(
                            t('parties:socialism_sa_tsar_bomb_desc'),
                            {
                                toReplace: '<CAST>',
                                value: k => (
                                    <Typography component='span' color='secondary' key={k}>
                                        {cfg.special_abilities.tsar_bomb.turns_to_cast}
                                    </Typography>
                                ),
                            },
                            {
                                toReplace: '<FAMINE>',
                                value: k => (
                                    <Typography component='span' color='primary' key={k}>
                                        {t('parties:socialism_db_famine')}
                                    </Typography>
                                ),
                            },
                            {
                                toReplace: '<MULTIPLIER>',
                                value: k => (
                                    <Typography component='span' color='secondary' key={k}>
                                        {cfg.special_abilities.tsar_bomb.famine_multiplier_while_casting}
                                    </Typography>
                                ),
                            },
                            {
                                toReplace: '<RAD>',
                                value: k => (
                                    <Typography component='span' color='secondary' key={k}>
                                        {cfg.special_abilities.tsar_bomb.radiation_falloff_turns}
                                    </Typography>
                                ),
                            },
                        )}
                    </Typography>
                </Box>
            </Box>

            {/* Utopia Island */}
            <Box display='flex' marginTop='1em'>
                <Box display='flex' justifyItems='center' alignItems='center' marginRight='1em'>
                    <BlackBlockIcon sx={{ width: '200px !important', height: '200px !important' }} />
                </Box>
                <Box flex='1 1 auto'>
                    <Typography variant='h5'>{t('parties:socialism_sa_utopia_island')}</Typography>
                    <Typography variant='body1'>
                        {TSXUtils.replaceWithElement(
                            t('parties:socialism_sa_utopia_island_desc'),
                            {
                                toReplace: '<TROOPS>',
                                value: k => (
                                    <Typography component='span' color='secondary' key={k}>
                                        {cfg.special_abilities.utopia_island.troops_per_turn}
                                    </Typography>
                                ),
                            },
                            {
                                toReplace: '<FAMINE>',
                                value: k => (
                                    <Typography component='span' color='primary' key={k}>
                                        {t('parties:socialism_db_famine')}
                                    </Typography>
                                ),
                            },
                        )}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default LobbyPartyPageSocialism;
