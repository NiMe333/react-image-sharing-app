import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

function AddPhoto() {
  const userContext = useContext(UserContext);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    if (!name) {
      setError("Vnesi ime slike.");
      return;
    }

    if (!file) {
      setError("Izberi sliko.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    formData.append("image", file);

    const res = await fetch("http://localhost:5001/photos", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      setUploaded(true);
    } else {
      setError("Napaka pri nalaganju slike.");
    }
  }

  if (!userContext.user) {
    return <Navigate replace to="/login" />;
  }

  if (uploaded) {
    return <Navigate replace to="/" />;
  }

  return (
    <Container sx={{ mt: 6, maxWidth: "600px" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h4" gutterBottom>
          Objavi sliko
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Naslov slike"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Opis slike"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            {file ? file.name : "Izberi sliko"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          <Button type="submit" variant="contained" fullWidth>
            Naloži
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddPhoto;
