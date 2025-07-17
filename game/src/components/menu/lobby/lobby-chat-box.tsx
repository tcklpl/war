import { useGameSession } from ':hooks/use-game-session';
import { Box, Divider, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './lobby-screen.scss';

import ChatIcon from '@mui/icons-material/Chat';

const LobbyChatBox = () => {
	const { chat, currentLobby } = useGameSession();

	const [msg, setMsg] = useState('');
	const { t } = useTranslation(['lobby']);

	const sendMessage = useCallback(() => {
		currentLobby?.chat.sendMessage(msg);
		setMsg('');
	}, [msg, currentLobby?.chat]);

	return (
		<>
			<Typography sx={{ marginBottom: '1em' }}>
				<ChatIcon sx={{ verticalAlign: 'middle', marginRight: '0.3em' }} />
				{t('lobby:chat')}
			</Typography>
			<Box display='flex' flexDirection='column' justifyContent='space-between' component={Paper}>
				<List sx={{ flexGrow: 1, overflowY: 'auto', height: '300px' }}>
					<ListItem key='info'>
						<ListItemText secondary={t('lobby:chat_info_msg')} />
					</ListItem>
					{chat.map(msg => (
						<ListItem key={crypto.randomUUID()}>
							<ListItemText primary={msg.msg} secondary={msg.sender} />
						</ListItem>
					))}
				</List>
				<Divider />
				<Paper
					component='form'
					onSubmit={e => {
						e.preventDefault();
						sendMessage();
					}}
				>
					<TextField variant='standard' value={msg} onChange={e => setMsg(e.currentTarget.value)} fullWidth />
				</Paper>
			</Box>
		</>
	);
};

export default LobbyChatBox;
