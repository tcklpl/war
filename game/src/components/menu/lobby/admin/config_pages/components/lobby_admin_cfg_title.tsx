import { TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';

const LobbyAdminConfigTitle: React.FC<{ title: string }> = ({ title }) => {
    return (
        <TableRow>
            <TableCell colSpan={2} align='center'>
                <Typography variant='h5'>{title}</Typography>
            </TableCell>
        </TableRow>
    );
};

export default LobbyAdminConfigTitle;
