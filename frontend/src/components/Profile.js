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

  useEffect(function () {
    const getProfile = async function () {
      const res = await fetch("http://localhost:5001/users/profile", {
        credentials: "include",
      });
      const data = await res.json();
      setProfile(data);
    };
    getProfile();
  }, []);

  if (!userContext.user) {
    return <Navigate replace to="/login" />;
  }

  if (!profile) {
    return (
      <Container sx={{ mt: 6 }}>
        <CircularProgress />
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

        <Typography variant="body2" color="text.secondary">
          To je tvoj uporabniški profil.
        </Typography>
      </Paper>
    </Container>
  );
}

export default Profile;
