import { SvgIconProps } from "@mui/material";
import { FunctionComponent } from "react";

import { ReactComponent as IconSrc } from "./fearsome_enemy.svg";
import CustomIcon from "../custom_icon";

const FearsomeEnemyIcon: FunctionComponent<SvgIconProps> = ({...props}) => {
    return (
        <CustomIcon svg={IconSrc} {...props}/>
    );
}
 
export default FearsomeEnemyIcon;