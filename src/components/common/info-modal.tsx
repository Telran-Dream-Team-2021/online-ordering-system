import React, {FC} from 'react';
import {Box, Button, List, ListItem, Modal, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {sm: '60vw', md: '40vw', xs: '80vw'},
    bgcolor: 'primary.light',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export type ModalProps = {
    title: string,
    message: string[],
    onClose: () => void
    open: boolean,
    imageUrl?: string,
    addRemove?: any
}

const InfoModal: React.FC<ModalProps> = (props) => {
    const {open, onClose, title, imageUrl, message, addRemove} = props
    return <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Button sx={{float: 'right'}} onClick={onClose}><CloseIcon/></Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {title}
            </Typography>
            <Box id="modal-modal-description" sx={{ mt: 2 }}>
                <img src={imageUrl} height={350}/>
                <List>
                    {message.map((e, index) => <ListItem key={index}>{e}</ListItem>)}
                </List>
            </Box>

            {!!addRemove&&(addRemove.flag?
                <Box><Button onClick={()=>{
                    addRemove.addRemoveFns.remove()
                    addRemove.setFlag(!addRemove.flag)
                }}>
                    <RemoveShoppingCartIcon/>
                </Button></Box>:
                <Box><Button onClick={()=>{
                    addRemove.addRemoveFns.add()
                    addRemove.setFlag(!addRemove.flag)
                }}>
                    <AddShoppingCartIcon/>
                </Button></Box>)}
        </Box>
    </Modal>
};

export default InfoModal;