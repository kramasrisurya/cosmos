// ============================================================
// pages/Home.jsx — Hero landing page
//
// First thing the user sees. Shows:
//   - Boot sequence text
//   - Big COSMOS title with blinking cursor
//   - Live stat counters (fetched from asteroid API)
//   - CTA buttons linking to other pages
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { API } from '../utils/constants';
import './Home.css';

// Helper — get today and +7 days as YYYY-MM-DD strings
function getDateRange() {
  const today = new Date().toISOString().split('T')[0];
  const end   = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  return { today, end };
}

function Home() {
  const { today, end } = getDateRange();
  const canvasRef = useRef(null); // reference to starfield canvas

  // Fetch asteroid count for the hero stat counter
  const { data: neoData } = useFetch(API.ASTEROIDS(today, end));
  const neoCount = neoData
    ? Object.values(neoData.near_earth_objects).flat().length
    : '—';

  // ── Starfield canvas animation ──────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let stars    = [];
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-create stars to fill new canvas size
      stars = Array.from({ length: 280 }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.2 + 0.2,
        alpha: Math.random(),
        da:    (Math.random() - 0.5) * 0.005,
        speed: Math.random() * 0.06 + 0.01,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        // Twinkle
        s.alpha = Math.max(0.05, Math.min(1, s.alpha + s.da));
        if (s.alpha <= 0.05 || s.alpha >= 1) s.da *= -1;
        // Slow drift downward
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 234, 237, ${s.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Hero stats shown in the bottom grid
  const stats = [
    { val: neoCount, label: 'NEOs THIS WEEK' },
    { val: '408',    label: 'ISS ALTITUDE KM' },
    { val: '5',      label: 'LIVE APIs' },
    { val: '3',      label: 'ACTIVE ROVERS' },
  ];

  return (
    <div className="home">
      {/* Background star canvas */}
      <canvas ref={canvasRef} className="home-starfield" />

      {/* Grid overlay */}
      <div className="home-grid-bg" />

      {/* Main hero content */}
      <div className="home-inner">
        {/* Boot sequence lines */}
        <div className="boot-header">
          <div>COSMOS MISSION CONTROL v2.0 &nbsp;|&nbsp; <span>NASA API INTEGRATION ACTIVE</span></div>
          <div>INITIALIZING DATA FEEDS... <span>[ OK ]</span></div>
          <div>UPLINK STATUS: <span>NOMINAL</span></div>
        </div>

        {/* Big title */}
        <h1 className="hero-title">
          COSMOS<span className="cursor-blink" />
        </h1>

        <p className="hero-subtitle">// NASA SPACE EXPLORER — REAL-TIME DATA</p>

        {/* Stat grid */}
        <div className="hero-stats">
          {stats.map(({ val, label }) => (
            <div key={label} className="hero-stat">
              <div className="hero-stat-val">{val}</div>
              <div className="hero-stat-key">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hero-cta">
          <Link to="/apod"  className="btn btn-primary">ENTER SYSTEM</Link>
          <Link to="/news"  className="btn btn-ghost">LATEST DISPATCH</Link>
        </div>
      </div>

      <div className="hero-scroll-hint">SCROLL TO INITIALIZE</div>
    </div>
  );
}

export default Home;
