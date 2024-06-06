import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import { ReactComponent as IconSrc } from './capitalism.svg';
import CustomIcon from '../custom_icon';

const CapitalismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default CapitalismIcon;
