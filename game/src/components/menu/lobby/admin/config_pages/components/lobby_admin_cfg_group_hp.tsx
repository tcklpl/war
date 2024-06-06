import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LobbyAdminConfigOption from './lobby_admin_cfg_option';

interface LobbyAdminConfigGroupHpParams {
    hp: number;
    setHp: (hp: number) => void;
    maxHp: number;
    setMaxHp: (hp: number) => void;
    disabled?: boolean;
}

const LobbyAdminConfigGroupHp: React.FC<LobbyAdminConfigGroupHpParams> = ({ hp, setHp, maxHp, setMaxHp, disabled }) => {
    const { t } = useTranslation(['common', 'lobby']);

    const [internalHp, setInternalHp] = useState(hp);
    const [internalMaxHp, setInternalMaxHp] = useState(maxHp);

    useEffect(() => {
        setInternalMaxHp(currentMaxHp => Math.max(currentMaxHp, internalHp));
    }, [internalHp]);

    useEffect(() => {
        if (internalHp !== hp) setHp(internalHp);
    }, [internalHp, setHp, hp]);

    useEffect(() => {
        if (internalMaxHp !== maxHp) setMaxHp(internalMaxHp);
    }, [internalMaxHp, setMaxHp, maxHp]);

    return (
        <>
            <LobbyAdminConfigOption
                options={{
                    type: 'number',
                    name: t('common:hp'),
                    description: t('common:hp_desc'),
                    value: internalHp,
                    setter: setInternalHp,
                    min: 1,
                    max: 99,
                    disabled: disabled,
                }}
            />
            <LobbyAdminConfigOption
                options={{
                    type: 'number',
                    name: t('common:max_hp'),
                    description: t('common:max_hp_desc'),
                    value: internalMaxHp,
                    setter: setInternalMaxHp,
                    min: Math.max(hp, 1),
                    max: 99,
                    disabled: disabled,
                }}
            />
        </>
    );
};

export default LobbyAdminConfigGroupHp;
