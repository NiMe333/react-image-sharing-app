import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  Divider,
  Paper,
} from "@mui/material";

function PhotoDetails() {
  const { id } = useParams();
  const userContext = useContext(UserContext);

  const [photo, setPhoto] = useState(null);
  const [comment, setComment] = useState("");
  const [deleted, setDeleted] = useState(false);

  async function getPhoto() {
    const res = await fetch("http://localhost:5001/photos/" + id, {
      credentials: "include",
    });

    if (!res.ok) {
      alert("Slike ni mogoče naložiti.");
      return;
    }

    const data = await res.json();
    setPhoto(data);
  }

  useEffect(() => {
    getPhoto();
  }, []);

  async function likePhoto() {
    const res = await fetch("http://localhost:5001/photos/" + id + "/like", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Napaka pri like.");
      return;
    }

    getPhoto();
  }

  async function dislikePhoto() {
    const res = await fetch("http://localhost:5001/photos/" + id + "/dislike", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Napaka pri like.");
      return;
    }

    getPhoto();
  }

  async function reportPhoto() {
    const res = await fetch("http://localhost:5001/photos/" + id + "/report", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Slika je bila prijavljena.");
      return;
    }

    if (data.message === "Already reported") {
      alert("To sliko si že prijavil.");
    } else if (data.message === "Login required") {
      alert("Za prijavo slike moraš biti prijavljen.");
    } else {
      alert("Prijava slike ni uspela.");
    }
  }

  async function deletePhoto() {
    if (!window.confirm("Ali res želiš izbrisati to sliko?")) {
      return;
    }

    const res = await fetch("http://localhost:5001/photos/" + id, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setDeleted(true);
    } else {
      alert("Slike ni mogoče izbrisati.");
    }
  }

  async function addComment(e) {
    e.preventDefault();

    if (!comment.trim()) return;

    const res = await fetch("http://localhost:5001/photos/" + id + "/comment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: comment,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Napaka pri komentarju.");
      return;
    }

    setComment("");
    getPhoto();
  }

  if (deleted) {
    return <Navigate replace to="/" />;
  }
  if (!photo) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Nalaganje...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4, maxWidth: "900px" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardMedia
          component="img"
          image={"http://localhost:5001" + photo.path}
          alt={photo.name}
          sx={{
            maxHeight: 600,
            objectFit: "contain",
            backgroundColor: "#111",
          }}
        />

        <CardContent>
          <Typography variant="h4" gutterBottom>
            {photo.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {photo.message}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip label={`👍 ${photo.likes}`} color="success" />
            <Chip label={`👎 ${photo.dislikes}`} color="error" />
          </Box>

          <Typography variant="body2">
            <b>Avtor:</b> {photo.postedBy?.username}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <b>Datum:</b> {new Date(photo.createdAt).toLocaleString()}
          </Typography>

          {userContext.user && (
            <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
              <Button variant="contained" color="success" onClick={likePhoto}>
                Like
              </Button>

              <Button variant="contained" color="error" onClick={dislikePhoto}>
                Dislike
              </Button>

              <Button variant="outlined" color="warning" onClick={reportPhoto}>
                Prijavi neprimerno vsebino
              </Button>

              {userContext.user?._id === photo.postedBy?._id && (
                <Button variant="contained" color="error" onClick={deletePhoto}>
                  Izbriši sliko
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Komentarji
        </Typography>

        {userContext.user && (
          <Box
            component="form"
            onSubmit={addComment}
            sx={{ display: "flex", gap: 2, mb: 3 }}
          >
            <TextField
              fullWidth
              label="Dodaj komentar"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button type="submit" variant="contained">
              Objavi
            </Button>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {photo.comments?.length === 0 ? (
          <Typography color="text.secondary">Ni še komentarjev.</Typography>
        ) : (
          photo.comments?.map((c) => (
            <Box key={c._id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">
                {c.user?.username || "Uporabnik"}
              </Typography>

              <Typography>{c.text}</Typography>

              <Typography variant="caption" color="text.secondary">
                {new Date(c.createdAt).toLocaleString()}
              </Typography>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
}

export default PhotoDetails;
