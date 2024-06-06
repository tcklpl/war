import { SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

import { ReactComponent as AnarchismIconSrc } from './anarchism.svg';
import CustomIcon from '../custom_icon';

const AnarchismIcon: FunctionComponent<SvgIconProps> = ({ ...props }) => {
    return <CustomIcon svg={AnarchismIconSrc} {...props} />;
};

export default AnarchismIcon;
