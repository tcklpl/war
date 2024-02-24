import { Box, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { useGameSession } from "../../../../../hooks/use_game_session";
import { useTranslation } from "react-i18next";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";

const LobbyPageInfo = () => {

    const { currentLobbyState, username } = useGameSession();
    const { t } = useTranslation(["lobby"]);

    const stepperSteps = [
        {
            label: t("lobby:lobby_step_1"),
            description: t("lobby:lobby_step_1_desc")
        },
        {
            label: t("lobby:lobby_step_2"),
            description: t("lobby:lobby_step_2_desc")
        },
        {
            label: t("lobby:lobby_step_3"),
            description: t("lobby:lobby_step_3_desc")
        },
        {
            label: t("lobby:lobby_step_4"),
            description: t("lobby:lobby_step_4_desc")
        }
    ]
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {

        // if not all players are done selecting their parties
        if (currentLobbyState?.players.some(p => p.party === "not_set")) {
            setCurrentStep(() => 1);
            return;
        }

        setCurrentStep(() => 2);
    }, [currentLobbyState]);
    
    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4">{ t("lobby:lobby") }: { currentLobbyState?.name }</Typography>
            <Typography variant="body1">{ t("lobby:joinable") }: { currentLobbyState?.joinable ? <CheckIcon sx={{ verticalAlign: 'middle' }}/> : <CloseIcon sx={{ verticalAlign: 'middle' }}/> }</Typography>
            <Typography variant="body2">{ t("common:playing_as")} { username }</Typography>

            <Stepper activeStep={currentStep} orientation="vertical" sx={{ width: '100%'}}>
                {stepperSteps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{ step.label }</StepLabel>
                        <StepContent>
                            <Typography>{ step.description }</Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default LobbyPageInfo;
