import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e) {
    e.preventDefault(); // prepreči HTML submit, ki bi refreshal stran

    const res = await fetch("http://localhost:5001/users/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();

    if (data.user && data.user._id && res.ok) {
      setSuccess(true);
    } else {
      setUsername("");
      setPassword("");
      setEmail("");
      setError("Registracija ni uspela.");
    }
  }

  if (success) {
    return <Navigate to="/login" />;
  }

  return (
    <Container sx={{ mt: 6, maxWidth: "500px" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h4" gutterBottom>
          Registracija
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Uporabniško ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button type="submit" variant="contained" fullWidth>
            Registriraj se
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Že imaš račun? <Link to="/login">Prijava</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
