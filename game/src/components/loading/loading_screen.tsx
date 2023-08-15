import { Box, Container, Grid, LinearProgress, Stack, Typography } from "@mui/material"
import React from "react"
import './loading_screen.scss';
import { useTranslation } from "react-i18next";

const LoadingScreen: React.FC = () => {

    const { t } = useTranslation(['loading', 'common']);

    return (
        <Container maxWidth="sm">
            <Box className="loading-screen">
                <Grid container direction="column" justifyContent="center" alignItems="center" height="100%">

                    <Stack spacing={2}>
                        <Typography variant="h4">
                            {t("loading:main_message")}
                        </Typography>

                        <LinearProgress color="primary" variant="buffer" value={10} valueBuffer={30}/>
                        <LinearProgress color="secondary" variant="determinate" value={50} />

                        <Typography>
                            {t("loading:initializing")}: 5 {t("common:out_of")} 10 
                        </Typography>
                    </Stack>

                </Grid>
            </Box>
        </Container>
    );
}

export default LoadingScreen;