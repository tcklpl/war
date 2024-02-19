import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { ReactComponent as IconSrc } from "./dragon.svg";
import CustomIcon from "../custom_icon";

const DragonIcon: FunctionComponent<SvgIconProps> = ({...props}) => {
    return (
        <CustomIcon svg={IconSrc} {...props}/>
    );
}
 
export default DragonIcon;