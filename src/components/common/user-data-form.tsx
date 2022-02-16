import React, {useEffect, useRef, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Container, CssBaseline, Grid, TextField} from "@mui/material";
import {UserData} from "../../models/common/user-data";
import {useDispatch, useSelector} from "react-redux";
import {userDataSelector} from "../../redux/store";
import {updateUserDataAction} from "../../redux/actions";

type UserFormData = {
    country: string,
    state: string,
    city: string,
    street: string,
    displayName: string,
    email: string
}

type UserDataFormProps = {
    closeFn: () => void,
}

const initialUserFormData: UserFormData = {city: "", displayName: "", email: "", state: "", street: "", country: ""};

const UserDataForm: React.FC<UserDataFormProps> = (props) => {
    const userData: UserData = useSelector(userDataSelector);
    const [spinner, setSpinner] = useState(false);
    const [flValid, setValid] = useState<boolean>(false);
    const errors =useRef<Map<string, string>>(new Map<string, string>());
    const [formData, setFormData] = useState<UserFormData>(
        {...initialUserFormData, email: userData.email, displayName: userData.displayName}
    );
    const dispatch = useDispatch();


    useEffect(() => {
        let res = true;
        for (const formDataKey in formData) {
            if (formDataKey !== 'state' && !(formData as any)[formDataKey]) {
                res = false;
                break;
            }
        }

        setValid(res);
    }, [formData]);// eslint-disable-line react-hooks/exhaustive-deps

    function buildAddress(formData: UserFormData): string {
        return `${formData.country}, ${formData.state}, ${formData.city}, ${formData.street}`;
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        setSpinner(true);

        try {
            const deliveryAddress = buildAddress(formData);
            const email = formData.email;
            const displayName = formData.displayName;

            dispatch(updateUserDataAction({...userData, deliveryAddress, email, displayName}));

            errors.current.delete('main');
            props.closeFn();
        } catch (e) {
            errors.current.set('main', 'Something went wrong! ' + e);
        }

        setSpinner(false);
    }

    function justSet(event: any) {
        const value = event.target.value;
        const field = event.target.name;

        if (!value) {
            errors.current.set(field, `${field} is required`);
        } else {
            errors.current.delete(field);
        }

        if (formData.hasOwnProperty(field)) {
            (formData as any)[field] = value;
            setFormData({...formData});
        }
    }

    function reset() {
        props.closeFn();
    }

    return <Container component="main">
        <Backdrop//TODO
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={spinner}
            onClick={() => setSpinner(false)}
        >
            <CircularProgress color="inherit"/>
        </Backdrop>
        <CssBaseline/>

        <Box component="form" onSubmit={onSubmit} sx={{mt: 1}} onReset={reset}>
            <Grid container spacing={5} p={5}>
                <Grid item xs={6}>
                    <TextField
                        disabled={!!userData.displayName}
                        error={errors.current.has('displayName')}
                        helperText={errors.current.get('displayName')}
                        label="Contact Name"
                        required={true}
                        type="text"
                        fullWidth
                        value={formData.displayName}
                        name="displayName"
                        onChange={justSet}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={errors.current.has('country')}
                        helperText={errors.current.get('country')}
                        required={true}
                        label="Country"
                        type="text"
                        fullWidth
                        value={formData.country}
                        name="country"
                        onChange={justSet}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        disabled={!!userData.email}
                        error={errors.current.has('email')}
                        helperText={errors.current.get('email')}
                        required={true}
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        name="email"
                        onChange={justSet}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={errors.current.has('state')}
                        helperText={errors.current.get('state')}
                        required={true}
                        label="State / Province"
                        type="text"
                        fullWidth
                        value={formData.state}
                        name="state"
                        onChange={justSet}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={errors.current.has('street')}
                        helperText={errors.current.get('street')}
                        required={true}
                        label="Street address, P. O. box, etc."
                        type="text"
                        fullWidth
                        value={formData.street}
                        name="street"
                        onChange={justSet}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={errors.current.has('city')}
                        helperText={errors.current.get('city')}
                        required={true}
                        label="City"
                        type="text"
                        fullWidth
                        value={formData.city}
                        name="city"
                        onChange={justSet}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={3}>
                    <Button
                        disabled={!flValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Confirm
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        type="reset"
                        fullWidth
                        variant="text"
                        sx={{mt: 3, mb: 2}}
                    >
                        Go to catalog
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </Container>
};

export default UserDataForm;