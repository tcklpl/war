import { Box, Container, Grid, Stack, Typography } from "@mui/material"
import React from "react"
import logo from './no_webgpu_icon.png';
import './failed_to_start_engine_screen.scss';
import { useTranslation } from "react-i18next";
import { useCrash } from "../../../hooks/use_crash";

const FailedToStartEngineScreen: React.FC = () => {

    const { t } = useTranslation(["engine"]);
    const { engineInitializationCrash } = useCrash();

    return !!engineInitializationCrash ? (
        <Container maxWidth="md">
            <Box className="failed-to-initialize-engine-screen">
                <Grid container direction="column" justifyContent="center" alignItems="center" height="100%">

                    <Stack spacing={10} alignItems="center" direction="row">
                        <img src={logo} />

                        <Stack spacing={2} justifyContent="start" direction="column">
                            <Typography variant="h4">
                                {t("engine:unable_start_engine")}
                            </Typography>

                            <Typography>
                                {t("engine:unable_start_engine_explanation")}
                            </Typography>

                            <Typography style={{ opacity: 0.5 }}>
                                {t("engine:disabled_webgpu")}
                            </Typography>
                        </Stack>
                    </Stack>

                </Grid>
            </Box>
        </Container>
    ) : <></>;
}

export default FailedToStartEngineScreen;