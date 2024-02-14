import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { ReactComponent as PowerVoidIconSrc } from "./power_void.svg";
import CustomIcon from "../custom_icon";

const PowerVoidIcon: FunctionComponent<SvgIconProps> = ({...props}) => {
    return (
        <CustomIcon svg={PowerVoidIconSrc} {...props}/>
    );
}
 
export default PowerVoidIcon;