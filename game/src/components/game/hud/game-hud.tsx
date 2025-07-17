import { Box } from '@mui/material';
import type { FunctionComponent } from 'react';
import HUDCommonPlayOrder from './common/play-order/hud-common-play-order';
import HUDCommonTopInfo from './common/top-info/hud-common-top-info';
import PauseScreen from './paused/pause-screen';

const GameHud: FunctionComponent = () => {
	return (
		<Box
			display='flex'
			flexDirection='column'
			height='100%'
			width='100%'
			position='fixed'
			bgcolor='transparent'
			sx={{ pointerEvents: 'none' }}
		>
			{/* Top HUD: Generic information */}
			<Box>
				<HUDCommonTopInfo />
			</Box>

			{/* Central HUD: Play order on the right side */}
			<Box display='flex' flex='1 0 auto' justifyContent='end' alignItems='center'>
				<Box flex='0 0 auto'>
					<HUDCommonPlayOrder />
				</Box>
			</Box>

			{/* Bottom HUD: Specific to each party */}
			<Box />

			{/* Other Game HUD Windows and utils */}
			<PauseScreen />
		</Box>
	);
};

export default GameHud;
