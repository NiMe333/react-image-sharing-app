import { useState, useEffect } from "react";
import Photo from "./Photo";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function () {
    const getPhotos = async function () {
      try {
        const res = await fetch("http://localhost:5001/photos");

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Napaka pri nalaganju slik.");
          return;
        }

        setPhotos(data);
      } catch (err) {
        setError("Napaka pri povezavi s strežnikom.");
      } finally {
        setLoading(false);
      }
    };

    getPhotos();
  }, []);

  // loading stanje
  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Photos
      </Typography>

      {photos.length === 0 ? (
        <Typography>Ni še nobenih slik.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {photos.map((photo) => (
            <Photo photo={photo} key={photo._id} />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Photos;
