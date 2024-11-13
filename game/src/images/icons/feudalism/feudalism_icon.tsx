import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import CustomIcon from '../custom_icon';
import IconSrc from './feudalism.svg?react';

const FeudalismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default FeudalismIcon;
