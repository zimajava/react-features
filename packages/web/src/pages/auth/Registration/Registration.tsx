import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Alert } from '../components/Alert';
import { Form } from '../components/Form';
import { NavLink, Modal } from '../../shared-components';

const validationSchema = yup.object({
  name: yup.string().min(3, 'Username should be of minimum 3 characters length').required('Username is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password is required'),
});

export default function Registration() {
  const [user, setUser] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const togglePassword = () => setShowPassword((prevState) => !prevState);
  const toggleConfirmPassword = () => setShowConfirmPassword((prevState) => !prevState);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(false);

      try {
        const url = 'http://localhost:3500/authentication/register';
        const { data } = await axios.post(url, values, { withCredentials: true });

        setUser(data);
        handleOpenModal();
      } catch (e) {
        console.log(e.response.data.message);
        // @ts-ignore
        formikHelpers.setErrors({ errorMsg: e.response.data.message });
      }

      // onSubmit(values).catch((e) => {
      //   formikHelpers.setSubmitting(false);
      //
      //   if (isFormError(e)) {
      //     formikHelpers.setErrors(e.errors);
      //   } else {
      //     throw e;
      //   }
      // });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          SignUp
        </Typography>
        <Form name="register" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <Box sx={{ marginBottom: 2 }}>
            {/* @ts-ignore */}
            {formik.errors && formik.errors?.errorMsg && <Alert color="error">{formik.errors.errorMsg}</Alert>}
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                required
                fullWidth
                variant="outlined"
                error={formik.touched.password && Boolean(formik.errors.password)}
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  name="password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePassword}
                        onMouseDown={togglePassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  aria-describedby="password-confirmation-helper-text"
                  autoComplete="new-password"
                />
                {formik.touched.password && (
                  <FormHelperText id="password-confirmation-helper-text">{formik.errors.password}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                required
                fullWidth
                variant="outlined"
                error={formik.touched.password && Boolean(formik.errors.password)}
              >
                <InputLabel htmlFor="passwordConfirmation">Password Confirmation</InputLabel>
                <OutlinedInput
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleConfirmPassword}
                        onMouseDown={toggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password Confirmation"
                  aria-describedby="password-confirmation-helper-text"
                  autoComplete="password-confirmation"
                />
                {formik.touched.passwordConfirmation && (
                  <FormHelperText id="password-confirmation-helper-text">
                    {formik.errors.passwordConfirmation}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={formik.isSubmitting}>
            Submit
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <NavLink to="/signin" variant="body2">
                Already have an account? Sign in
              </NavLink>
            </Grid>
          </Grid>
        </Form>
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <>
          <Typography variant="h6" component="h2">
            {`Hi, ${user?.name}!`}
          </Typography>
          <Typography id="spring-modal-description" sx={{ mt: 2 }}>
            {`Check your email to confirm: ${user?.email}`}
          </Typography>
        </>
      </Modal>
    </Container>
  );
}
