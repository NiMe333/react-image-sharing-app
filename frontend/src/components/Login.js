import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Navigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const userContext = useContext(UserContext);

  async function Login(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.user && data.user._id) {
      userContext.setUserContext(data.user);
    } else {
      setUsername("");
      setPassword("");
      setError("Napačno uporabniško ime ali geslo.");
    }
  }

  return (
    <Container sx={{ mt: 6, maxWidth: "500px" }}>
      {userContext.user ? <Navigate replace to="/" /> : ""}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prijava
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={Login}>
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
            Prijavi se
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Še nimaš računa? <Link to="/register">Registriraj se</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
