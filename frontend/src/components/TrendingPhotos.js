import { useState, useEffect } from "react";
import Photo from "./Photo";
import { Container, Typography, Box } from "@mui/material";

function TrendingPhotos() {
  const [photos, setPhotos] = useState([]);

  useEffect(function () {
    // koda se izvede enkrat, ko se komponenta naloži
    const getTrendingPhotos = async function () {
      const res = await fetch("http://localhost:5001/photos/trending", {
        credentials: "include",
      });

      const data = await res.json();
      console.log("TRENDING:", data);
      setPhotos(data);
    };

    getTrendingPhotos();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🔥 Trending photos
      </Typography>

      {photos.length === 0 ? (
        <Typography>Ni še trending slik.</Typography>
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

export default TrendingPhotos;
