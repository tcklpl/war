import { Switch, TableCell, TableRow, TextField, Typography } from "@mui/material";
import React from "react"
import { MathUtils } from "../../../../../../utils/math_utils";

interface LobbyAdminConfigCommonOptions {
    name: string;
    description: string;
    disabled?: boolean;
}

type LobbyAdminConfigOptions = {
    type: "number";
    value: number;
    setter: (value: number) => void;
    min?: number;
    max?: number;
} | {
    type: "boolean";
    value: boolean;
    setter: (value: boolean) => void;
}

const LobbyAdminConfigOption: React.FC<{options: LobbyAdminConfigOptions & LobbyAdminConfigCommonOptions}> = ({ options }) => {

    const handleNumber = (val: string) => {
        if (!val) return;
        if (options.type === 'number') {
            const min = options.min ?? 0;
            const max = options.max ?? 1000;
            const parsed = parseInt(val);
            const value = MathUtils.clamp(min, max, parsed);
            options.setter(value);
        }
    }

    return (
        <TableRow>
            <TableCell>
                <Typography variant="body1">{ options.name }</Typography>
                <Typography variant="body2" color="gray">{ options.description }</Typography>
            </TableCell>
            <TableCell align="right">
                {
                    options.type === 'number' ? (
                        <TextField type="number" value={options.value} onChange={e => handleNumber(e.currentTarget.value)} disabled={options.disabled}/>
                    ) : (
                        <Switch checked={options.value} onChange={e => options.setter(e.currentTarget.checked)} disabled={options.disabled}/>
                    )
                }
            </TableCell>
        </TableRow>
    );
}

export default LobbyAdminConfigOption;