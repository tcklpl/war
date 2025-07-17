export type ReconnectionStatus =
	| {
			result: 'success';
			new_token: string;
	  }
	| {
			result: 'error';
			reason:
				| 'invalid token'
				| 'game does not exist'
				| 'player wasnt in lobby'
				| 'player still playing'
				| 'game moved on'
				| 'other';
	  };
