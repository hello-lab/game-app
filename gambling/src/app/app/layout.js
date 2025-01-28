"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const router = useRouter();

    useEffect(() => {
        setActiveLink(router.pathname);
    }, [router.pathname]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = (href) => {
        setActiveLink(href);
        setTimeout(() => {setActiveLink('');}, 100);
        setMenuOpen(!menuOpen);
        router.push(href);
    };

    return (
        
                
                <div style={{ padding: '20px' }}>
                    <header style={{ fontWeight:"bold",display: 'flex', marginBottom: '20px' }}>
                        <img className="logo" src="/logo.png" alt="Logo" style={{ borderRadius:'1vh', marginRight: '10px' }} />
                        <button style={{borderRadius:'0.5vh'}} className="hamburger-menu" onClick={toggleMenu}>
                            <span className="hamburger-icon"></span>
                        </button>
                    
                    <nav className={` navbar ${menuOpen ? 'open' : ''}`} style={{ alignItems: 'center', width: '100%', padding: '1px', justifyContent: 'center' }}>
                        <div className="menu-wrap">
                            <div className="full-wrap">
                                <ul className="tab-menu flex list-none p-1">
                                    <li className={` first ver-menu ${activeLink === '/app/home' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/home')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
</svg>
Home</a>
                                    </li>
                                    <li className={`hidden ver-menu ${activeLink === '/inplay' ? 'active' : ''}`} onClick={() => handleLinkClick('/inplay')}>
                                        <a className="navbar-item hover:underline">In-Play</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/roulette' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/roulette')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M45.5 24c0 11.874-9.626 21.5-21.5 21.5S2.5 35.874 2.5 24S12.126 2.5 24 2.5S45.5 12.126 45.5 24"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M35.905 24c0 6.575-5.33 11.905-11.905 11.905S12.095 30.575 12.095 24S17.425 12.095 24 12.095S35.905 17.425 35.905 24"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M28.16 28.686a6.17 6.17 0 0 1-4.081 1.538c-3.425 0-6.202-2.787-6.202-6.224s2.777-6.224 6.202-6.224a6.2 6.2 0 0 1 5.904 4.32"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m26.377 21.802l3.757.305l.356-3.79m-.537 15.993l4.773 8.267M13.274 5.423l4.773 8.266m0 20.621l-4.773 8.267M34.747 5.386l-4.798 8.31M12.096 24H2.5m43 0h-9.596"/></svg> Roulette</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/cricket' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/cricket')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path fill="currentColor" d="M15.05,12.81L6.56,4.32c-0.39-0.39-1.02-0.39-1.41,0L2.32,7.15c-0.39,0.39-0.39,1.02,0,1.41l8.49,8.49 c0.39,0.39,1.02,0.39,1.41,0l2.83-2.83C15.44,13.83,15.44,13.2,15.05,12.81z"/><rect fill="currentColor" height="6" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -8.5264 17.7562)" width="2" x="16.17" y="16.17"/></g><circle fill="currentColor" cx="18.5" cy="5.5" r="3.5"/></g></g></svg>Cricket</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/crash' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/crash')}>
                                        <a className="navbar-item heartBeat hover:underline">
                                            <img style={{ width: 50 + "px" }} src="/plane.png" className="aviatorImg" /> &nbsp;Vimaan
                                        </a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/tennis' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/tennis')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path fill="currentColor" d="M19.52,2.49c-2.34-2.34-6.62-1.87-9.55,1.06c-1.6,1.6-2.52,3.87-2.54,5.46c-0.02,1.58,0.26,3.89-1.35,5.5l-4.24,4.24 l1.42,1.42l4.24-4.24c1.61-1.61,3.92-1.33,5.5-1.35s3.86-0.94,5.46-2.54C21.38,9.11,21.86,4.83,19.52,2.49z M10.32,11.68 c-1.53-1.53-1.05-4.61,1.06-6.72s5.18-2.59,6.72-1.06c1.53,1.53,1.05,4.61-1.06,6.72S11.86,13.21,10.32,11.68z"/><path fill="currentColor" d="M18,17c0.53,0,1.04,0.21,1.41,0.59c0.78,0.78,0.78,2.05,0,2.83C19.04,20.79,18.53,21,18,21s-1.04-0.21-1.41-0.59 c-0.78-0.78-0.78-2.05,0-2.83C16.96,17.21,17.47,17,18,17 M18,15c-1.02,0-2.05,0.39-2.83,1.17c-1.56,1.56-1.56,4.09,0,5.66 C15.95,22.61,16.98,23,18,23s2.05-0.39,2.83-1.17c1.56-1.56,1.56-4.09,0-5.66C20.05,15.39,19.02,15,18,15L18,15z"/></g></svg>Tennis</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/soccer' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/soccer')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path fill="currentColor" d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M13,5.3l1.35-0.95 c1.82,0.56,3.37,1.76,4.38,3.34l-0.39,1.34l-1.35,0.46L13,6.7V5.3z M9.65,4.35L11,5.3v1.4L7.01,9.49L5.66,9.03L5.27,7.69 C6.28,6.12,7.83,4.92,9.65,4.35z M7.08,17.11l-1.14,0.1C4.73,15.81,4,13.99,4,12c0-0.12,0.01-0.23,0.02-0.35l1-0.73L6.4,11.4 l1.46,4.34L7.08,17.11z M14.5,19.59C13.71,19.85,12.87,20,12,20s-1.71-0.15-2.5-0.41l-0.69-1.49L9.45,17h5.11l0.64,1.11 L14.5,19.59z M14.27,15H9.73l-1.35-4.02L12,8.44l3.63,2.54L14.27,15z M18.06,17.21l-1.14-0.1l-0.79-1.37l1.46-4.34l1.39-0.47 l1,0.73C19.99,11.77,20,11.88,20,12C20,13.99,19.27,15.81,18.06,17.21z"/></g></g></svg>Soccer</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/horseracing' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/horseracing')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M144 104a16 16 0 1 1-16-16a16 16 0 0 1 16 16m92 25.53A108.3 108.3 0 0 1 130.18 236h-2.25A107.3 107.3 0 0 1 56 208.94a12 12 0 1 1 16-17.88a81.4 81.4 0 0 0 16.2 11.26l21.54-29.62c-20.4-7-41.91-3.33-54.43-1.21a35.79 35.79 0 0 1-35.25-14.43c-.16-.21-.31-.43-.45-.65l-13.78-22A12 12 0 0 1 9.43 118L108 53.51V32a12 12 0 0 1 12-12h8a108 108 0 0 1 108 109.53m-24-.33a84 84 0 0 0-80-85.11V60a12 12 0 0 1-5.43 10l-94.16 61.61l7.31 11.68a12 12 0 0 0 11.58 4.54c16.23-2.75 49.4-8.36 79.64 8A36 36 0 0 0 164 120a12 12 0 0 1 24 0a60.09 60.09 0 0 1-53.64 59.66l-22.45 30.87a87.6 87.6 0 0 0 17.8 1.45A84.29 84.29 0 0 0 212 129.2"/></svg>Horse Racing</a>
                                    </li>
                                    <li className={`hidden ver-menu ${activeLink === '/app/greyhoundracing' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/greyhoundracing')}>
                                        <a className=" navbar-item hover:underline">Greyhound Racing</a>
                                    </li>
                                    <li hidden className={`ver-menu ${activeLink === '/app/lottery' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/lottery')}>
                                        <a className="navbar-item hover:underline">Lottery</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/poker1' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/poker1')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><path fill="currentColor" d="M64 512h256q27 0 45.5-18.5T384 448V64q0-27-18.5-45.5T320 0H64Q37 0 18.5 18.5T0 64v384q0 27 18.5 45.5T64 512M43 64q0-21 21-21h256q21 0 21 21v384q0 21-21 21H64q-21 0-21-21zm106 235q12 0 22-7v49h-22v22h86v-22h-22v-49q10 7 22 7q17 0 29.5-13t12.5-30t-12.5-30t-29.5-13q0-17-13-29.5T192 171t-30 12.5t-13 29.5q-17 0-29.5 13T107 256t12.5 30t29.5 13"/></svg>Live Casino</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/virtualsports' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/virtualsports')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 16.5a1 1 0 0 1-.527.881l-7.907 4.443a.996.996 0 0 1-1.132 0l-7.907-4.443A1 1 0 0 1 3 16.5v-9a1 1 0 0 1 .527-.881l7.907-4.443a.995.995 0 0 1 1.132 0l7.907 4.443A1 1 0 0 1 21 7.5v9zM5.5 14.316c-.552-.313-1-.118-1 .434s.448 1.253 1 1.566c.552.313 1 .118 1-.434s-.448-1.253-1-1.566zm0-4c-.552-.313-1-.118-1 .434s.448 1.253 1 1.566c.552.313 1 .118 1-.434s-.448-1.253-1-1.566zm4 6.264c-.552-.313-1-.118-1 .434s.448 1.253 1 1.566c.552.312 1 .118 1-.434c0-.553-.448-1.254-1-1.566zm-2-3.132c-.552-.313-1-.118-1 .434s.448 1.253 1 1.566c.552.312 1 .118 1-.434c0-.553-.448-1.254-1-1.566zm2-.868c-.552-.313-1-.119-1 .434c0 .552.448 1.253 1 1.566c.552.312 1 .118 1-.434c0-.553-.448-1.254-1-1.566zm9 1.736c-.552.313-1 1.014-1 1.566s.448.746 1 .434c.552-.313 1-1.014 1-1.566s-.448-.747-1-.434zm0-4c-.552.313-1 1.014-1 1.566s.448.747 1 .434s1-1.014 1-1.566s-.448-.747-1-.434zm-4 6.264c-.552.312-1 1.014-1 1.566s.448.746 1 .434c.552-.313 1-1.014 1-1.566s-.448-.747-1-.434zm0-4c-.552.312-1 1.014-1 1.566s.448.746 1 .434c.552-.313 1-1.014 1-1.566s-.448-.747-1-.434zm1.992-4.81c.547-.321.602-.806.124-1.082s-1.31-.24-1.856.083c-.547.322-.602.807-.124 1.083c.478.276 1.31.239 1.856-.083zm-7.425.333c.547-.322.603-.807.124-1.083c-.478-.276-1.309-.239-1.856.083c-.547.322-.602.807-.124 1.083c.478.276 1.31.24 1.856-.083zm3.713-.166c.546-.322.602-.807.124-1.083c-.479-.276-1.31-.239-1.857.083c-.546.322-.602.807-.124 1.083c.479.276 1.31.239 1.857-.083z" fill="currentColor"/></svg>Virtual Sports</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/tips' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/tips')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 17a1 1 0 0 1-2 0V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13a2 2 0 0 0 2 2h15c1.654 0 3-1.346 3-3V7h-2zM12 7h3v2h-3zm0 4h3v2h-3zM5 7h5v6H5zm0 10v-2h10v2z"/></svg>Tips & Previews</a>
                                    </li>
                                    <li className={`last ver-menu ${activeLink === '/app/profile' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/profile')}>
                                        <a className="navbar-item hover:underline"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path  d="M0 0h24v24H0z" fill="none"/><path fill="currentColor" d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></svg>Profile</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    </header>
                    <div style={{ display: 'flex', minHeight: '100vh' }}>
                        <div style={{borderRadius:'2vh',     boxShadow:" 0 0 20px 3px #ff00ff", width: '100%', backgroundColor: '#f0f0f0', padding: '10px' }}>
                            <img src="/banner.jpg" alt="Banner" style={{ borderRadius:'2vh', border:"inset violet",   width: '100%', marginBottom: '10px' }} />
                            {children}
                        </div>
                    </div>
                </div>
            
       
    );
}
