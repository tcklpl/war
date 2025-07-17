import type { SvgIconProps } from '@mui/material';
import type { FunctionComponent } from 'react';

import CustomIcon from '../custom-icon';
import PowerVoidIconSrc from './power-void.svg?react';

const PowerVoidIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
	return <CustomIcon svg={PowerVoidIconSrc} {...props} />;
};

export default PowerVoidIcon;
