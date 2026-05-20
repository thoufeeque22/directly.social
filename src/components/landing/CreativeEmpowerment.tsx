import { Box, Typography, Container } from "@mui/material";

export default function CreativeEmpowerment() {
  return (
    <Container maxWidth="md" sx={{ py: 6, bgcolor: 'background.paper', borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crafted for Empathy
      </Typography>
      <Typography variant="body1" color="text.secondary">
        We believe technology should amplify your humanity, not replace it. Our AI assistants 
        are designed to learn your unique voice, ensuring your content always feels authentic 
        and deeply personal.
      </Typography>
    </Container>
  );
}
