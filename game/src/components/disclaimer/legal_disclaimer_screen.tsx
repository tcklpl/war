import GavelIcon from '@mui/icons-material/Gavel';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './legal_disclaimer_screen.module.scss';

interface LegalDisclaimerScreenProps {}

const LegalDisclaimerScreen: FunctionComponent<LegalDisclaimerScreenProps> = () => {
    const { t } = useTranslation(['disclaimer']);
    const [showScreen, setShowScreen] = useState(false);
    const disclaimerVersion = 1;

    useEffect(() => {
        const acceptedVersion = localStorage.getItem('legal-disclosure-acceptance-version');
        if (!acceptedVersion) {
            setShowScreen(true);
            return;
        }

        const acceptedVersionNumber = parseInt(acceptedVersion);
        if (acceptedVersionNumber < disclaimerVersion) {
            setShowScreen(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('legal-disclosure-acceptance-version', `${disclaimerVersion}`);
        setShowScreen(false);
    };

    return (
        showScreen && (
            <Container maxWidth='md' className={style['disclaimer-screen']}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100vh'}>
                    <Stack spacing={5}>
                        <Box>
                            <Typography variant='h2'>
                                <GavelIcon fontSize='inherit' sx={{ verticalAlign: 'middle', marginRight: '0.5em' }} />
                                {t('disclaimer:legal_title')}
                            </Typography>
                            <Typography variant='caption'>
                                {t('version')} {disclaimerVersion}
                            </Typography>
                        </Box>
                        <Typography variant='body1' align='justify'>
                            {t('disclaimer:legal_content_p1')}
                        </Typography>
                        <Typography variant='body1' align='justify'>
                            {t('disclaimer:legal_content_p2')}
                        </Typography>
                        <Typography variant='body1' align='justify'>
                            {t('disclaimer:legal_content_p3')}
                        </Typography>
                        <Box display={'flex'} justifyContent={'end'}>
                            <Button variant='contained' onClick={accept}>
                                {t('disclaimer:i_understand')}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        )
    );
};

export default LegalDisclaimerScreen;
