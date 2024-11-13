import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import CustomIcon from '../custom_icon';
import IconSrc from './capitalism.svg?react';

const CapitalismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default CapitalismIcon;
