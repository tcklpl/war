import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import CustomIcon from '../custom_icon';
import IconSrc from './spontaneous_spawn.svg?react';

const SpontaneousSpawnIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={IconSrc} {...props} />;
};

export default SpontaneousSpawnIcon;
