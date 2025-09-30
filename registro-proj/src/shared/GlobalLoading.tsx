import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useLoading } from "./LoadingContext";

export default function GlobalLoading() {
  const { isOpen, message } = useLoading();

  return (
    <Backdrop
      open={isOpen}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 1, // sopra tutto ( non abbiamo tema però quindi da cambiare mi sa)
        bgcolor: "rgba(0,0,0,0.4)",
      }}
      aria-live="polite"
      role="status"
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={56} thickness={4} />
        <Typography variant="subtitle1">{message}</Typography>
      </Stack>
    </Backdrop>
  );
}
