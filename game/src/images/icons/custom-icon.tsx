import type { SvgIconProps } from '@mui/material';
import { SvgIcon } from '@mui/material';
import type { FunctionComponent } from 'react';

const CustomIcon: FunctionComponent<SvgIconProps & { svg: any }> = ({ className, svg, ...props }) => {
	return <SvgIcon component={svg} inheritViewBox className={`${className} custom-icon`} {...props} />;
};

export default CustomIcon;
