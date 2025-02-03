"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import Loading from './loading.js'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/background1.png';
    img.onload = () => setLoad(true);
  }, []);

  return (
    <html lang="en">
      <head>
    <meta charSet="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="title" content="Chibi Games"/>
    <meta name="description" content="Chibi Games is a secure and exciting online betting platform featuring casino games, live dealers, and fast payouts."/>
    <meta name="keywords" content="online betting,  casino games, live dealer, esports betting,  fast payouts, secure gaming, mobile betting, cute"/>
    <meta name="author" content="Chibi Games Team"/>
    <meta name="robots" content="index, follow"/>
    <meta name="language" content="English"/>
    <meta name="revisit-after" content="7 days"/>
    
    <meta property="og:title" content="Chibi Games – Online Betting Platform"/>
    <meta property="og:description" content="Join Chibi Games for an exhilarating online betting experience. Play casino games, and enjoy live dealers with fast payouts."/>
    <meta property="og:image" content="https://game.niyogi.hackclub.app/logo.png"/>
    <meta property="og:type" content="website"/>

    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Chibi Games – Online Betting Platform"/>
    <meta name="twitter:description" content="Experience online betting like never before with Chibi Games. Play, win, and withdraw instantly."/>
    <meta name="twitter:image" content="https://game.niyogi.hackclub.app/logo.png"/>

    <title>Chibi Games – Cutest Betting Platform</title>
</head>
      <body
       
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <div className="loading"style={{ display: !load ? 'block' : 'none' }}>
          <Loading/>
        </div>
        <div className="body"
         style={{ backgroundImage: `url(/background1.png)`, display: load ? 'block' : 'none' }}>
        <Toaster />
        {children}
        </div>
      </body>
    </html>
  );
}
