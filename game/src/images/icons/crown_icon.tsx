import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { ReactComponent as IconSrc } from "./crown.svg";
import CustomIcon from "./custom_icon";

const CrownIcon: FunctionComponent<SvgIconProps> = ({...props}) => {
    return (
        <CustomIcon svg={IconSrc} {...props}/>
    );
}
 
export default CrownIcon;