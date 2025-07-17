import type { SvgIconProps } from '@mui/material';
import type { FunctionComponent } from 'react';

import CustomIcon from '../custom-icon';
import AnarchismIconSrc from './anarchism.svg?react';

const AnarchismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
	return <CustomIcon svg={AnarchismIconSrc} {...props} />;
};

export default AnarchismIcon;
