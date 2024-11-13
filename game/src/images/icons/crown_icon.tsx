import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import IconSrc from './crown.svg?react';
import CustomIcon from './custom_icon';

const CrownIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default CrownIcon;
