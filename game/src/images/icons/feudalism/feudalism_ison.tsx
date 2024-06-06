import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import { ReactComponent as IconSrc } from './feudalism.svg';
import CustomIcon from '../custom_icon';

const FeudalismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default FeudalismIcon;
