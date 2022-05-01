import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik } from 'formik';
import {useDispatch, useSelector} from "react-redux";
import {loginTC} from "./auth-reducer";
import {AppRootStateType} from "../../app/store";
import {Navigate} from "react-router-dom";
import {LoginParamsType} from "../../api/todolists-api";

// type FormikErrorType = {
//     email?: string
//     password?: string
//     rememberMe?: boolean
// } необязателно при использовании Partial, используем Partial<Omit<LoginParamsType, 'captcha'>> в 36 строке вместо FormikErrorType

export const Login = () => {

    const dispatch = useDispatch();

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: Partial<Omit<LoginParamsType, 'captcha'>> = {};
            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password){
                errors.password = 'Password is required';
            } else if (values.password.length < 3){
                errors.password = 'Password must be more than 3 characters'
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm();
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <TextField
                        label="Email"
                        margin="normal"
                        {...formik.getFieldProps('email')}
                    />
                    {
                        formik.touched.email &&
                        formik.errors.email
                            ? <div style={{color:'red'}}>{formik.errors.email}</div>: null
                    }
                    {   formik.touched.password &&
                        formik.errors.password
                            ? <div style={{color:'red'}}>{formik.errors.password}</div>: null
                    }
                    <TextField
                        type="password"
                        label="Password"
                        margin="normal"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    <FormControlLabel
                        label={'Remember me'}
                        control={<Checkbox
                            onChange={formik.handleChange}
                            checked={formik.values.rememberMe}
                            name="rememberMe"
                        />}/>
                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
            </FormControl>
            </form>
        </Grid>
    </Grid>
}
