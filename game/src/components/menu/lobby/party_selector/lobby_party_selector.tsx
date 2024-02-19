import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, Switch, Tab, Typography } from "@mui/material";
import { ReactElement, useState } from "react";
import LobbyPartyPageAnarchism from "./party_pages/lobby_party_page_anarchism";
import { useTranslation } from "react-i18next";
import { useGameSession } from "../../../../hooks/use_game_session";
import { GameParty } from "../../../../../../protocol";
import "../lobby_screen.scss";

import InfoIcon from '@mui/icons-material/Info';
import AnarchismIcon from "../../../../images/icons/anarchism/anarchism_icon";
import FeudalismIcon from "../../../../images/icons/feudalism/feudalism_ison";
import SocialismIcon from "../../../../images/icons/socialism/socialism_ison";
import CapitalismIcon from "../../../../images/icons/capitalism/capitalism_ison";
import { TSXUtils } from "../../../../utils/tsx_utils";
import LobbyPageInfo from "./party_pages/lobby_page_info";
import LobbyPartyPageFeudalism from "./party_pages/lobby_party_page_feudalism";
import LobbyPartyPageSocialism from "./party_pages/lobby_party_page_socialism";

const LobbyPartySelectorScreen = () => {

    const { t } = useTranslation(["lobby", "parties"]);
    const { username, currentLobby, currentLobbyState } = useGameSession();
    const playerParty = currentLobbyState?.players.find(p => p.name === username)?.party;

    const [partyPage, setPartyPage] = useState<GameParty | "none">("none");
    const isPartyAvailable = !currentLobbyState?.players.find(p => p.party === partyPage);
    const partyPagePlayer = currentLobbyState?.players.find(p => p.party === partyPage);

    const partyDecoratorMap = new Map<GameParty, {name: string, icon: ReactElement}>([
        ["anarchism", { name: t("parties:anarchism"), icon: (<AnarchismIcon/>)}],
        ["feudalism", { name: t("parties:feudalism"), icon: (<FeudalismIcon/>)}],
        ["socialism", { name: t("parties:socialism"), icon: (<SocialismIcon/>)}],
        ["capitalism", { name: t("parties:capitalism"), icon: (<CapitalismIcon/>)}],
    ]);

    return (
            <Box sx={{ bgcolor: 'background.paper', display: 'flex', flexGrow: 1, minHeight: 0, height: '100%', width: '100%' }}>
                <TabContext value={partyPage}>
                    
                    <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                        <TabList onChange={(_, val) => setPartyPage(val)} orientation="vertical">
                            <Tab icon={<InfoIcon/>} label="Lobby Info" value="none" />
                            <Tab icon={<AnarchismIcon/>} label={t("parties:anarchism")} value={"anarchism"} />
                            <Tab icon={<FeudalismIcon/>} label={t("parties:feudalism")} value={"feudalism"} />
                            <Tab icon={<SocialismIcon/>} label={t("parties:socialism")} value={"socialism"} />
                            <Tab icon={<CapitalismIcon/>} label={t("parties:capitalism")} value={"capitalism"} />
                        </TabList>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <TabPanel value="none" className="lobby-growable-tab-panel"><LobbyPageInfo/></TabPanel>
                        <TabPanel value={"anarchism"} className="lobby-growable-tab-panel"><LobbyPartyPageAnarchism/></TabPanel>
                        <TabPanel value={"feudalism"} className="lobby-growable-tab-panel"><LobbyPartyPageFeudalism/></TabPanel>
                        <TabPanel value={"socialism"} className="lobby-growable-tab-panel"><LobbyPartyPageSocialism/></TabPanel>
                        <TabPanel value={"capitalism"} className="lobby-growable-tab-panel">capital</TabPanel>

                        {
                            partyPage !== "none" && (
                                <Box justifySelf="end" marginTop="1em" padding="1em" display="flex" justifyContent="end" alignItems="center">

                                    {
                                        partyPagePlayer && (
                                            <Typography marginRight="1em">
                                                {
                                                    TSXUtils.replaceWithElement(t("lobby:party_is_selected_by"), {
                                                        toReplace: '<PARTY>',
                                                        value: (<Typography color="secondary" component="span" display="inline" key={0}>{ partyDecoratorMap.get(partyPage)?.name }</Typography>)
                                                    },
                                                    {
                                                        toReplace: '<PLAYER>',
                                                        value: (<Typography color="secondary" component="span" display="inline" key={1}>{ partyPagePlayer.name }</Typography>)
                                                    })
                                                }
                                            </Typography>
                                        )
                                    }
                                    <Button
                                        variant="outlined"
                                        disabled={!playerParty && !isPartyAvailable}
                                        sx={{ verticalAlign: 'middle' }}
                                        onClick={() => {
                                            if (playerParty) {
                                                currentLobby?.deselectCurrentParty();
                                            } else {
                                                currentLobby?.selectParty(partyPage);
                                            }
                                        }}
                                    >
                                        {
                                            playerParty ? (
                                                `${t("lobby:locked_as")} ${partyDecoratorMap.get(playerParty)?.name}`
                                            ) : (
                                                `${t("lobby:select")} ${partyDecoratorMap.get(partyPage)?.name}`
                                            )
                                        }
                                        <Switch disabled checked={!!playerParty}/>
                                    </Button>
                                </Box>
                            )
                        }
                    </Box>
                </TabContext>
            </Box>
    );
}

export default LobbyPartySelectorScreen;