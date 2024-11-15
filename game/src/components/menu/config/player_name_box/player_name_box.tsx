import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';

import { useGameSession } from ':hooks/use_game_session';
import EditIcon from '@mui/icons-material/Edit';

const PlayerNameBox: React.FC = () => {
    const { username, setUsername, saveGameSession } = useGameSession();

    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>();

    const edit = useCallback(() => {
        setEditing(true);
        inputRef.current?.focus();
    }, []);

    const save = useCallback(() => {
        setEditing(false);
        saveGameSession();
    }, [saveGameSession]);

    return (
        <Paper
            component='form'
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            onSubmit={e => {
                e.preventDefault();
                save();
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='Name'
                disabled={!editing}
                ref={inputRef}
                value={username}
                onChange={e => setUsername(e.currentTarget.value)}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
            <IconButton color='primary' sx={{ p: '10px' }} onClick={() => (editing ? save : edit)()}>
                <EditIcon />
            </IconButton>
        </Paper>
    );
};

export default PlayerNameBox;
