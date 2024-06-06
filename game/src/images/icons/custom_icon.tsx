import { SvgIcon, SvgIconProps } from '@mui/material';
import { FunctionComponent } from 'react';

const CustomIcon: FunctionComponent<SvgIconProps & { svg: any }> = ({ className, svg, ...props }) => {
    return <SvgIcon component={svg} inheritViewBox className={`${className} custom-icon`} {...props} />;
};

export default CustomIcon;
