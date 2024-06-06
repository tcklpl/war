import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import { ReactComponent as IconSrc } from './offensive_maniac.svg';
import CustomIcon from '../custom_icon';

const OffensiveManiacIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default OffensiveManiacIcon;
