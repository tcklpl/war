import React, { useEffect } from "react"
import { useTranslation } from "react-i18next";
import LobbyAdminConfigOption from "./lobby_admin_cfg_option";

interface LobbyAdminConfigGroupHpParams {
    hp: number;
    setHp: (hp: number) => void;
    maxHp: number;
    setMaxHp: (hp: number) => void;
    disabled?: boolean;
}

const LobbyAdminConfigGroupHp: React.FC<LobbyAdminConfigGroupHpParams> = ({hp, setHp, maxHp, setMaxHp, disabled}) => {

    const { t } = useTranslation(["common", "lobby"]);

    useEffect(() => {
        setMaxHp(Math.max(maxHp, hp));
    }, [hp, setMaxHp, maxHp]);

    return <>
        <LobbyAdminConfigOption options={{
            type: "number",
            name: t("common:hp"),
            description: t("common:hp_desc"),
            value: hp,
            setter: setHp,
            min: 1,
            max: 99,
            disabled: disabled
        }}/>
        <LobbyAdminConfigOption options={{
            type: "number",
            name: t("common:max_hp"),
            description: t("common:max_hp_desc"),
            value: maxHp,
            setter: setMaxHp,
            min: Math.max(hp, 1),
            max: 99,
            disabled: disabled
        }}/>
    </>;
}

export default LobbyAdminConfigGroupHp;