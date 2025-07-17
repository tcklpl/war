import type { SvgIconProps } from '@mui/material';
import type { FunctionComponent } from 'react';

import CustomIcon from '../custom-icon';
import IconSrc from './dragon.svg?react';

const DragonIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
	return <CustomIcon svg={IconSrc} {...props} />;
};

export default DragonIcon;
