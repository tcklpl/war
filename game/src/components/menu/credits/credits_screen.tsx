import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import { Box, Container, Grid, IconButton, Link, Stack, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import { CreditScreenEntry } from './credit_screen_entry';

interface CreditsScreenProps {}

const CreditsScreen: FunctionComponent<CreditsScreenProps> = () => {
    const { t } = useTranslation(['common', 'credits']);
    const { palette } = useTheme();

    const people = new Map<string, CreditScreenEntry>([
        ['tcklpl', { name: 'Luan Negroni Sibinel', alias: 'tcklpl', github: 'https://github.com/tcklpl' }],
        ['Jão', { name: 'João Victor Martiniano', alias: 'Jão', github: '' }],
        ['Anakin86708', { name: 'Ariel Tadeu da Silva', alias: 'Getúlio', github: 'https://github.com/Anakin86708' }],
        [
            'Kesley',
            { name: 'Kesley Henrique Pereira Amorim', alias: 'Kesley', github: 'https://github.com/Kesley-Amorim' },
        ],
        [
            'renatojuniorrs',
            { name: 'Renato Donizeti Junior', alias: 'Renatinho', github: 'https://github.com/renatojuniorrs' },
        ],
        ['Victor', { name: 'Victor Matheus Monteiro', alias: 'Victor 2', github: '' }],
        [
            'ElectroKhan',
            { name: 'Marcelo Davi Ferreira Pereira', alias: 'ElectroKhan', github: 'https://github.com/electrokhan' },
        ],
        [
            'Jader',
            { name: 'Jader Gedeon de Oliveira Rocha', alias: 'Redaji', github: 'https://github.com/JaderGedeon' },
        ],
        ['Greggman', { name: 'Greggman', alias: 'Greggman', github: 'https://github.com/greggman' }],
    ]);

    const nameToElement = (name: string) => {
        const entry = people.get(name);
        if (!entry) return <></>;

        const splitName = entry.name.split(' ');
        const firstName = splitName[0];
        const restOfTheName = splitName.splice(1).join(' ');

        return (
            <Typography textAlign='start' variant='body1'>
                {firstName}
                <Typography display='inline' color='secondary' component='span'>
                    {` (${entry.alias}) `}
                </Typography>
                {restOfTheName}
                {entry.github && (
                    <Link href={entry.github} target='_blank' rel='noopener noreferrer'>
                        <GitHubIcon
                            color='secondary'
                            sx={{ verticalAlign: 'middle', marginLeft: '0.3em', marginRight: '0.3em' }}
                        />
                    </Link>
                )}
            </Typography>
        );
    };

    return (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
            <Container>
                <Grid
                    container
                    className='server-select-screen'
                    style={{ backgroundColor: palette.background.default }}
                    justifyContent='center'
                    alignContent='center'
                >
                    <Stack spacing={5} width='100%' height='100%'>
                        <Link to='/' component={RouterLink} alignSelf='center'>
                            <IconButton color='inherit' sx={{ flexDirection: 'column' }} disableRipple>
                                <ArrowBackIcon />
                                <Typography variant='caption'>{t('common:back_to_menu')}</Typography>
                            </IconButton>
                        </Link>

                        <Box display='flex' alignSelf='center'>
                            <Link
                                href='https://github.com/tcklpl/war'
                                target='_blank'
                                rel='noopener noreferrer'
                                color='inherit'
                            >
                                <IconButton color='inherit' sx={{ flexDirection: 'column' }} disableRipple>
                                    <GitHubIcon />
                                    <Typography variant='caption'>GitHub</Typography>
                                </IconButton>
                            </Link>
                            <Link
                                href='https://trello.com/b/qBpWkPcw/war'
                                target='_blank'
                                rel='noopener noreferrer'
                                color='inherit'
                            >
                                <IconButton color='inherit' sx={{ flexDirection: 'column' }} disableRipple>
                                    <ViewKanbanIcon />
                                    <Typography variant='caption'>Trello</Typography>
                                </IconButton>
                            </Link>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>{t('credits:game_concept')}</b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('Jão')}
                                {nameToElement('Anakin86708')}
                                {nameToElement('Kesley')}
                                {nameToElement('renatojuniorrs')}
                                {nameToElement('Victor')}
                                {nameToElement('ElectroKhan')}
                                {nameToElement('Jader')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>{t('credits:engine_development')}</b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('tcklpl')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>{t('credits:3d_modelling')}</b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('Jader')}
                                {nameToElement('tcklpl')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>{t('credits:game_programming')}</b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('tcklpl')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>{t('credits:network')}</b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('tcklpl')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>
                                    {t('credits:localizations')} - {t('credits:loc_en_us')}
                                </b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('tcklpl')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>
                                    {t('credits:localizations')} - {t('credits:loc_pt_br')}
                                </b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('Anakin86708')}
                            </Stack>
                        </Box>

                        <Box
                            width='100%'
                            display='flex'
                            alignSelf='center'
                            justifyContent='center'
                            alignContent='center'
                        >
                            <Typography width='50%' textAlign='end' variant='body1' mr={2}>
                                <b>{t('credits:special_thanks')}</b>
                            </Typography>
                            <Stack direction='column' width='50%' ml={2}>
                                {nameToElement('Greggman')}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
            </Container>
        </Box>
    );
};

export default CreditsScreen;
