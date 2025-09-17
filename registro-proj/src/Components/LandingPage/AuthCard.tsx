import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";


export default function AuthCard() {
  return (
    <Card sx={{ width: { xs: "95%", sm: 400 },
        p: 3,
        borderRadius: 3,
        boxShadow: 6,
        textAlign: "center",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Benvenuto!
        </Typography>

        <Stack spacing={2} mt={2}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            fullWidth
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            size="large"
            fullWidth
          >
            Sign Up
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}