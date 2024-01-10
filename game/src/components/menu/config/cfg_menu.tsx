import { Button, Grid, Stack } from "@mui/material";
import React from "react";
import CfgScreen from "./cfg_screen";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CfgMenu: React.FC = () => {

    const navigate = useNavigate();
    const { t } = useTranslation(["common"]);

    return (
        <Grid container style={{ height: '100vh' }} justifyContent="center" alignContent="start">
            <Grid item xs={8} alignSelf="center">
                <Stack>
                    <Button variant="outlined" startIcon={<ArrowBackIcon/>} onClick={() => navigate("/")}>
                        { t("common:back_to_menu") }
                    </Button>
                    <CfgScreen/>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default CfgMenu;