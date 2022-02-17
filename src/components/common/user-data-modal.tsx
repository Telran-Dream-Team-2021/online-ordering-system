import React from 'react';
import {Box, Button, Modal, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import UserDataForm from "./user-data-form";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {sm: '70vw', md: '60vw', xs: '80vw'},
    boxShadow: 24,
    p: 4,
};

type ModalProps = {
    onClose: () => void
    open: boolean,
}

const UserDataModal: React.FC<ModalProps> = (props) => {
    return <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={{...style, bgcolor: "#FFFFFF"}}>
            <Button sx={{float: 'right'}} onClick={props.onClose}><CloseIcon/></Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                THE LAST STEP!
                ENTER SHIPPING ADDRESS
            </Typography>
            <UserDataForm closeFn={props.onClose} />
        </Box>
    </Modal>
};

export default UserDataModal;