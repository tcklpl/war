import { Grid2 } from '@mui/material';
import React from 'react';
import CfgScreen from '../screen/cfg_screen';

const CfgMenu: React.FC = () => {
    return (
        <Grid2 container style={{ height: '100vh' }} justifyContent='center' alignContent='start'>
            <Grid2 size={{ xs: 8 }} alignSelf='center' height={'100%'}>
                <CfgScreen showReturnToMenu />
            </Grid2>
        </Grid2>
    );
};

export default CfgMenu;
