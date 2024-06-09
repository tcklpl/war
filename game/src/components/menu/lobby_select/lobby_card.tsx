import { Card, CardContent, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { LobbyListStateLobby } from '../../../../../protocol';
import { useTranslation } from 'react-i18next';
import './lobby_select.scss';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const LobbyCard: React.FC<{
    lobby: LobbyListStateLobby;
    onJoinAttempt: () => void;
}> = ({ lobby, onJoinAttempt }) => {
    const { t } = useTranslation(['lobby']);

    const attemptJoin = useCallback(() => {
        if (!lobby.joinable) return;
        onJoinAttempt();
    }, [lobby, onJoinAttempt]);

    return (
        <Card elevation={3} onDoubleClick={() => attemptJoin()} className='lobby-card'>
            <CardContent>
                <Typography>{lobby.name}</Typography>
                <Typography color='GrayText'>{`${t('lobby:owner')}: ${lobby.owner_name}`}</Typography>
                <Typography color='GrayText'>{`${t('lobby:players_in_lobby')}: ${lobby.player_count}`}</Typography>
                <Typography color='GrayText'>
                    {lobby.joinable ? (
                        <CheckIcon className='lobby-card-icon' />
                    ) : (
                        <CloseIcon className='lobby-card-icon' />
                    )}
                    {`${t('lobby:joinable')}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LobbyCard;
