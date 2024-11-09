import { Button, Grid2, Stack } from '@mui/material';
import React from 'react';
import CfgScreen from '../screen/cfg_screen';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CfgMenu: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['common']);

    return (
        <Grid2 container style={{ height: '100vh' }} justifyContent='center' alignContent='start'>
            <Grid2 size={{ xs: 8 }} alignSelf='center'>
                <Stack>
                    <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
                        {t('common:back_to_menu')}
                    </Button>
                    <CfgScreen />
                </Stack>
            </Grid2>
        </Grid2>
    );
};

export default CfgMenu;
