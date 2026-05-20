import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import LandingHero from "@/components/landing/LandingHero";
import CreativeEmpowerment from "@/components/landing/CreativeEmpowerment";

export default async function Home() {
  const session = await auth();

  // If user is authenticated, redirect to dashboard/home content
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHero />
      <CreativeEmpowerment />
    </Box>
  );
}
