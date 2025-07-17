import { useCrash } from ':hooks/use-crash';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import './failed-to-start-engine-screen.scss';
import logo from './no-webgpu-icon.png';

const FailedToStartEngineScreen: React.FC = () => {
	const { t } = useTranslation(['engine']);
	const { engineInitializationCrash } = useCrash();

	return (
		engineInitializationCrash && (
			<Container maxWidth='md'>
				<Box className='failed-to-initialize-engine-screen'>
					<Grid container direction='column' justifyContent='center' alignItems='center' height='100%'>
						<Stack spacing={10} alignItems='center' direction='row'>
							<img src={logo} alt='' />

							<Stack spacing={2} justifyContent='start' direction='column'>
								<Typography variant='h4'>{t('engine:unable_start_engine')}</Typography>

								<Typography>{t('engine:unable_start_engine_explanation')}</Typography>

								<Typography style={{ opacity: 0.5 }}>{engineInitializationCrash.message}</Typography>
							</Stack>
						</Stack>
					</Grid>
				</Box>
			</Container>
		)
	);
};

export default FailedToStartEngineScreen;
