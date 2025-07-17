import { Grow, TableCell, TableRow, Typography } from '@mui/material';
import type { FunctionComponent } from 'react';

interface ConfigLabelProps {
	title: string;
	description: string;
	animationDelay: number;
	setTooltip: (info: { title: string; content: string } | undefined) => void;
	children: React.ReactNode;
}

const ConfigLabel: FunctionComponent<ConfigLabelProps> = ({
	title,
	description,
	animationDelay,
	setTooltip,
	children,
}) => {
	return (
		<Grow in timeout={animationDelay}>
			<TableRow
				onMouseEnter={() => {
					setTooltip({
						title,
						content: description,
					});
				}}
				onMouseLeave={() => setTooltip(undefined)}
			>
				<TableCell>
					<Typography variant='body1'>{title}</Typography>
				</TableCell>
				<TableCell align='right'>{children}</TableCell>
			</TableRow>
		</Grow>
	);
};

export default ConfigLabel;
