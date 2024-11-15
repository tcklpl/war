import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import CustomIcon from '../custom_icon';
import AnarchismIconSrc from './anarchism.svg?react';

const AnarchismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={AnarchismIconSrc} {...props} />;
};

export default AnarchismIcon;
