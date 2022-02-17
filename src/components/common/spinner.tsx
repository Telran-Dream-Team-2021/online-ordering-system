import React from 'react';
import {Backdrop, CircularProgress} from "@mui/material";

const Spinner: React.FC<{open: boolean, onClickFn: () => void}> = (props) => {
    return <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={props.open}
        onClick={props.onClickFn}
    >
        <CircularProgress color="inherit"/>
    </Backdrop>;
};

export default Spinner;