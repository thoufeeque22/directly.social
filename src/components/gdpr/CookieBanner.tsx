"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Slide,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CookieIcon from "@mui/icons-material/Cookie";

export const CookieBanner: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ss-consent="));
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // Analytics accepted
    document.cookie = "ss-consent=accepted; path=/; max-age=31536000; SameSite=Lax";
    setOpen(false);
  };

  const handleDecline = () => {
    // Essential only
    document.cookie = "ss-consent=declined; path=/; max-age=31536000; SameSite=Lax";
    setOpen(false);
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 24,
          left: { xs: 16, sm: 24 },
          right: { xs: 16, sm: "auto" },
          maxWidth: { sm: 400 },
          p: 3,
          borderRadius: 2,
          zIndex: 9999,
          backdropFilter: "blur(10px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(18, 18, 18, 0.9)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <CookieIcon color="primary" />
              <Typography variant="h6">Cookie Consent</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            We use cookies to enhance your experience and analyze our traffic.
            By clicking &quot;Accept All&quot;, you consent to our use of cookies.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
            <Button size="small" onClick={handleDecline} color="inherit">
              Essential Only
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleAccept}
              disableElevation
            >
              Accept All
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
};
