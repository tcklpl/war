import { Grid, Stack, Typography, useTheme } from "@mui/material"
import "./cfg_default_background.sass";
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from "react-i18next";

const CfgScreenDefaultBackground: React.FC = () => {

    const { palette } = useTheme();
    const { t } = useTranslation(["config"]); 

    return (
        <Grid container direction="column" style={{ backgroundColor: palette.background.default }} className="cfg-default-screen" justifyContent="center" alignItems="center">
            <Stack spacing={2} className="cfg-default-screen-content" alignItems="center">
                <SettingsIcon sx={{fontSize: 100}}/>
                <Typography variant="h4">
                    { t("config:default_screen_header") }
                </Typography>
                <Typography variant="body1">
                { t("config:default_screen_body") }
                </Typography>
            </Stack>
        </Grid>
    )
}

export default CfgScreenDefaultBackground;