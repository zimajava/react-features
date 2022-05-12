import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { Alert } from '../components/Alert';
import { Form } from '../components/Form';
import { NavLink, Container } from '../../shared-components';
import { setAuthenticated, setUser } from '../../Main/mainSlice';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(false);

      try {
        const url = 'http://localhost:3500/authentication/login';
        const { data } = await axios.post(url, values, { withCredentials: true });
        dispatch(setAuthenticated(true));
        dispatch(setUser(data));
        console.log(data);
      } catch (e) {
        console.log(e.response.data.message);
        // @ts-ignore
        formikHelpers.setErrors({ errorMsg: e.response.data.message });
      }
    },
  });

  return (
    <Container component={Paper}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        SignIn
      </Typography>
      <Form name="login" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <Box sx={{ marginBottom: 2 }}>
          {/* @ts-ignore */}
          {formik.errors && formik.errors?.errorMsg && <Alert color="error">{formik.errors.errorMsg}</Alert>}
        </Box>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
          Submit
        </Button>
        <Grid container>
          <Grid item xs>
            <NavLink to="/forgot-password" variant="body2">
              Forgot password?
            </NavLink>
          </Grid>
          <Grid item>
            <NavLink to="/signup" variant="body2">
              Don&apos;t have an account? Sign Up
            </NavLink>
          </Grid>
        </Grid>
      </Form>
    </Container>
  );
}
