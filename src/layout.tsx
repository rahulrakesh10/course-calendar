import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackProvider, useSnack } from "./SnackProvider";
import { useCallback } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Continuous Calendar",
  description: "A simple, fully customizable React Calendar, styled with Tailwindcss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SnackProvider>
      {children}
    </SnackProvider>
  );
}

const ExampleComponent = () => {
  const { createSnack } = useSnack();

  const handleClick = () => {
    createSnack('Event added successfully!', 'success');
  };

  return <button onClick={handleClick}>Add Event</button>;
};

const TestComponent = () => {
  const { createSnack } = useSnack();

  return (
    <div>
      <button onClick={() => createSnack('Test message', 'success')}>Test Snack</button>
    </div>
  );
};
