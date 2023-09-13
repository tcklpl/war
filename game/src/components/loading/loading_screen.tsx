import { Box, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import './loading_screen.sass';
import { useTranslation } from "react-i18next";
import { useGame } from "../../hooks/use_game";
import { LoadStage } from "../../game/loader/load_stage";

const LoadingScreen: React.FC = () => {

    const { t } = useTranslation(['loading']);
    const { gameInstance } = useGame();

    const [isLoading, setLoading] = useState(true);
    const [loadingStageMessage, setLoadingStageMessage] = useState<string>(t("loading:starting"));

    useEffect(() => {
        // if the game instance is undefined, this will happen when the canvas is unmounted on hot reload
        if (!gameInstance) {
            setLoading(true);
            setLoadingStageMessage(getLoadingStageMessage(LoadStage.STARTING));
            return;
        }
        
        // update the loading screen based on the loading state
        gameInstance.loader.onLoadStageChange(ls => {
            setLoadingStageMessage(getLoadingStageMessage(ls));

            if (ls === LoadStage.COMPLETE) setLoading(false);
        });
    }, [ gameInstance ]);

    const getLoadingStageMessage = (ls: LoadStage) => {
        switch (ls) {
            case LoadStage.STARTING:
                return t("loading:starting");
            case LoadStage.INITIALIZING_ENGINE:
                return t("loading:init_engine");
            case LoadStage.LOADING_ASSETS:
                return t("loading:load_assets");
            case LoadStage.INITIALIZING_GAME:
                return t("loading:init_game");
            case LoadStage.COMPLETE:
                return t("loading:finished");
        }
    }

    return isLoading ? (
        <Container maxWidth="sm">
            <Box className="loading-screen">
                <Grid container direction="column" justifyContent="center" alignItems="center" height="100%">

                    <Stack spacing={2} alignItems="center">
                        <Typography variant="h4" alignSelf="start">
                            {t("loading:main_message")}
                        </Typography>

                        <CircularProgress/>

                        <Typography alignSelf="start">
                            { loadingStageMessage }
                        </Typography>
                    </Stack>

                </Grid>
            </Box>
        </Container>
    ) : <></>;
}

export default LoadingScreen;