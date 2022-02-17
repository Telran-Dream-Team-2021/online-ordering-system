import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {FC} from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars: FC<{ message: string, open:boolean, handleState: ()=> void}> = (props) => {
    const {message, open, handleState} = props


    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleState}>
                <Alert onClose={handleState} severity="success" sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
export default CustomizedSnackbars;