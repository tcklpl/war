import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import { ReactComponent as IconSrc } from './frenzy.svg';
import CustomIcon from '../custom_icon';

const FrenzyIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default FrenzyIcon;
