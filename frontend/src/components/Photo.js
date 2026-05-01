import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";

function Photo(props) {
  const p = props.photo;

  return (
    <Card sx={{ width: 340, borderRadius: 3, boxShadow: 4 }}>
      <CardMedia
        component="img"
        height="240"
        image={"http://localhost:5001" + p.path}
        alt={p.name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {p.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {p.message}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip label={`👍 ${p.likes}`} color="success" size="small" />
          <Chip label={`👎 ${p.dislikes}`} color="error" size="small" />
          <Chip label={`Glasovi: ${p.likes - p.dislikes}`} size="small" />
        </Box>

        <Typography variant="body2">
          <b>Avtor:</b> {p.postedBy?.username}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {new Date(p.createdAt).toLocaleString()}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to={"/photos/" + p._id}
            fullWidth
          >
            Odpri sliko
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Photo;
