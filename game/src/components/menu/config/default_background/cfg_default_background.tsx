import { Grid, Stack, Typography, useTheme } from '@mui/material';
import style from './cfg_default_background.module.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

const CfgScreenDefaultBackground: React.FC = () => {
    const { palette } = useTheme();
    const { t } = useTranslation(['config']);

    return (
        <Grid
            container
            direction='column'
            style={{ backgroundColor: palette.background.default }}
            className={style.screen}
            justifyContent='center'
            alignItems='center'
        >
            <Stack spacing={2} className={style.content} alignItems='center'>
                <SettingsIcon sx={{ fontSize: 100 }} />
                <Typography variant='h4'>{t('config:default_screen_header')}</Typography>
                <Typography variant='body1'>{t('config:default_screen_body')}</Typography>
            </Stack>
        </Grid>
    );
};

export default CfgScreenDefaultBackground;
