import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import { Navigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";

function Profile() {
  const userContext = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    const getProfile = async function () {
      try {
        const res = await fetch("http://localhost:5001/users/profile", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Profila ni mogoče naložiti.");
          return;
        }

        setProfile(data);
      } catch (err) {
        setError("Napaka pri povezavi s strežnikom.");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (!userContext.user) {
    return <Navigate replace to="/login" />;
  }

  if (loading) {
    return (
      <Container sx={{ mt: 6 }}>
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
    <Container sx={{ mt: 6, maxWidth: "600px" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 60, height: 60 }}>
            {profile.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h4">{profile.username}</Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <b>Email:</b> {profile.email}
        </Typography>
      </Paper>
    </Container>
  );
}

export default Profile;
