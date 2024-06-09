import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import { ReactComponent as IconSrc } from './socialism.svg';
import CustomIcon from '../custom_icon';

const SocialismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default SocialismIcon;
