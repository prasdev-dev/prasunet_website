"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend:", data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Prasunet Website</h1>
      <p>Frontend is running</p>
    </main>
  );
}
