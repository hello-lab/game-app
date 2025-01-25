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
        router.push(href);
    };

    return (
        
                
                <div style={{ padding: '20px' }}>
                    <header style={{ fontSize: "5vh", display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src="/logo.png" alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
                        <button className="hamburger-menu" onClick={toggleMenu}>
                            <span className="hamburger-icon"></span>
                        </button>
                    </header>
                    <nav className={`navbar ${menuOpen ? 'open' : ''}`} style={{ alignItems: 'center', width: '100%', padding: '1px', justifyContent: 'center' }}>
                        <div className="menu-wrap">
                            <div className="full-wrap">
                                <ul className="tab-menu flex list-none p-1">
                                    <li className={`ver-menu ${activeLink === '/app/home' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/home')}>
                                        <a className="navbar-item hover:underline">Home</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/inplay' ? 'active' : ''}`} onClick={() => handleLinkClick('/inplay')}>
                                        <a className="navbar-item hover:underline">In-Play</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/home' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/home')}>
                                        <a className="navbar-item hover:underline">Multi Markets</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/cricket' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/cricket')}>
                                        <a className="navbar-item hover:underline">Cricket</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/crash' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/crash')}>
                                        <a className="navbar-item heartBeat hover:underline">
                                            <img style={{ width: 50 + "px" }} src="/plane.png" className="aviatorImg" /> &nbsp;Vimaan
                                        </a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/tennis' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/tennis')}>
                                        <a className="navbar-item hover:underline">Tennis</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/soccer' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/soccer')}>
                                        <a className="navbar-item hover:underline">Soccer</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/horseracing' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/horseracing')}>
                                        <a className="navbar-item hover:underline">Horse Racing</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/greyhoundracing' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/greyhoundracing')}>
                                        <a className="navbar-item hover:underline">Greyhound Racing</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/lottery' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/lottery')}>
                                        <a className="navbar-item hover:underline">Lottery</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/livecasino' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/livecasino')}>
                                        <a className="navbar-item hover:underline">Live Casino</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/virtualsports' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/virtualsports')}>
                                        <a className="navbar-item hover:underline">Virtual Sports</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/tips' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/tips')}>
                                        <a className="navbar-item hover:underline">Tips & Previews</a>
                                    </li>
                                    <li className={`ver-menu ${activeLink === '/app/profile' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/profile')}>
                                        <a className="navbar-item hover:underline">Profile</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div style={{ display: 'flex', minHeight: '100vh' }}>
                        <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '10px' }}>
                            <img src="/banner.jpg" alt="Banner" style={{ width: '100%', marginBottom: '10px' }} />
                            {children}
                        </div>
                    </div>
                </div>
            
       
    );
}
