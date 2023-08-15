import { Box, Modal } from "@mui/material"
import React, { useState } from "react"
import './crash_screen.scss';

const CrashScreen: React.FC = () => {

    const [open, setOpen] = useState(true);

    return (
        <Modal
            open={open}
            className="crash-screen"
        >
            <Box>
                Fuck fuck fuck 2
            </Box>
        </Modal>
    );
}

export default CrashScreen;