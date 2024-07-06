import { Card, CardContent, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { LobbyListStateLobby } from '../../../../../protocol';
import { useTranslation } from 'react-i18next';
import style from './lobby_select.module.scss';

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
        <Card elevation={3} onDoubleClick={() => attemptJoin()} className={style.card}>
            <CardContent>
                <Typography>{lobby.name}</Typography>
                <Typography color='GrayText'>{`${t('lobby:owner')}: ${lobby.owner_name}`}</Typography>
                <Typography color='GrayText'>{`${t('lobby:players_in_lobby')}: ${lobby.player_count}`}</Typography>
                <Typography color='GrayText'>
                    {lobby.joinable ? (
                        <CheckIcon className={style.cardIcon} />
                    ) : (
                        <CloseIcon className={style.cardIcon} />
                    )}
                    {`${t('lobby:joinable')}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LobbyCard;
