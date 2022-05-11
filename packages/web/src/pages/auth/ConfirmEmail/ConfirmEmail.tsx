import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { Alert } from '../components/Alert';

export default function ConfirmEmail() {
  const [error, setError] = React.useState('');
  const { token } = useParams<{ token: string }>();
  const { push } = useHistory();

  React.useEffect(() => {
    const url = 'http://localhost:3500/email-confirmation/confirm';
    axios
      .post(url, { token }, { withCredentials: true })
      .then(() => {
        push('/signin');
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }, [push, token]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component={Paper}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Confirm Email
        </Typography>
        {error && <Alert color="error">{error}</Alert>}
      </Box>
    </Container>
  );
}
