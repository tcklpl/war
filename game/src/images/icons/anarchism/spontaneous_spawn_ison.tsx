import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { ReactComponent as IconSrc } from "./spontaneous_spawn.svg";
import CustomIcon from "../custom_icon";

const SpontaneousSpawnIcon: FunctionComponent<SvgIconProps> = ({...props}) => {
    return (
        <CustomIcon svg={IconSrc} {...props}/>
    );
}
 
export default SpontaneousSpawnIcon;