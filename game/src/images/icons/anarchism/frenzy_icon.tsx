import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import CustomIcon from '../custom_icon';
import IconSrc from './frenzy.svg?react';

const FrenzyIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default FrenzyIcon;
