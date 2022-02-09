import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {ConfirmationDataType} from "../../models/common/confirmation-data-type";

const ConfirmDialog: React.FC<{data: ConfirmationDataType, open: boolean}> = (props) => {
    const {data, open} = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return <Box>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => data.handler(false)}
            aria-labelledby="dialog-title"
        >
            <DialogTitle id="dialog-title">
                {data.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {data.message || ''}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => data.handler(false)}>
                    Disagree
                </Button>
                <Button sx={{color: 'error.main'}} onClick={() => data.handler(true)} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
}

export default ConfirmDialog;