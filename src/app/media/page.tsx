import React from 'react';
import { Metadata } from 'next';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MediaLibrary } from "@/components/media/MediaLibrary";

export const metadata: Metadata = {
  title: "Media Library | SocialStudio",
};

export default async function MediaPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ padding: '2rem' }}>
      <MediaLibrary />
    </div>
  );
}
