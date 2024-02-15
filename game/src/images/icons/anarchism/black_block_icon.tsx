import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { ReactComponent as IconSrc } from "./black_block.svg";
import CustomIcon from "../custom_icon";

const BlackBlockIcon: FunctionComponent<SvgIconProps> = ({...props}) => {
    return (
        <CustomIcon svg={IconSrc} {...props}/>
    );
}
 
export default BlackBlockIcon;