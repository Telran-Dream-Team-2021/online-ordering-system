import React from 'react';
import {Box, Button, List, ListItem, Modal, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {sm: '60vw', md: '40vw', xs: '80vw'},
    bgcolor: '#35383f',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export type ModalProps = {
    title: string,
    message: string[],
    onClose: () => void
    open: boolean,
    imageUrl: string,
}

const InfoModal: React.FC<ModalProps> = (props) => {
    return <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Button sx={{float: 'right'}} onClick={props.onClose}><CloseIcon/></Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {props.title}
            </Typography>
            <Box id="modal-modal-description" sx={{ mt: 2 }}>
                <img src={props.imageUrl} height={350}/>
                <List>
                    {props.message.map((e, index) => <ListItem key={index}>{e}</ListItem>)}
                </List>
            </Box>
        </Box>
    </Modal>
};

export default InfoModal;