import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import CustomIcon from '../custom_icon';
import PowerVoidIconSrc from './power_void.svg?react';

const PowerVoidIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={PowerVoidIconSrc} {...props} />;
};

export default PowerVoidIcon;
