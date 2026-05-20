import { Typography, Button, Container } from "@mui/material";
import Link from "next/link";

export default function LandingHero() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Your Creative Studio, Reimagined.
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
        Empowering you to tell stories that resonate. We provide the tools, you provide the spark.
      </Typography>
      <Button component={Link} href="/dashboard" variant="contained" size="large" sx={{ mt: 4 }}>
        Enter Studio
      </Button>
    </Container>
  );
}
