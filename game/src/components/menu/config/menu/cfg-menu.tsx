import { Grid } from '@mui/material';
import type React from 'react';
import CfgScreen from '../screen/cfg-screen';

const CfgMenu: React.FC = () => {
	return (
		<Grid container style={{ height: '100vh' }} justifyContent='center' alignContent='start'>
			<Grid size={{ xs: 8 }} alignSelf='center' height={'100%'}>
				<CfgScreen showReturnToMenu />
			</Grid>
		</Grid>
	);
};

export default CfgMenu;
