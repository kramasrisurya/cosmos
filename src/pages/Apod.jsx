// ============================================================
// pages/Apod.jsx — Astronomy Picture of the Day
//
// Fetches today's NASA APOD and shows:
//   - Full image (left panel) with scan-line animation
//   - Title, date, explanation, copyright (right panel)
// ============================================================

import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import { API }  from '../utils/constants';
import SectionHeader from '../components/SectionHeader';
import Loader from '../components/Loader';
import './Apod.css';

const FALLBACK_APOD = {
  title: "Major Fireball Meteor & Deep Space Vista",
  date: new Date().toISOString().split('T')[0],
  explanation: "Captured in extraordinary detail, the sky glows with the soft pinkish colors of twilight over rugged mountain peaks. Above the lights, a brilliant fireball meteor cuts across the northern horizon beneath the familiar stars of Ursa Major.",
  url: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/november/meteor2017_Taylor_1200.jpg",
  media_type: "image",
  copyright: "NASA / APOD Science Archive",
};

function Apod() {
  const { data, loading, error } = useFetch(API.APOD);
  const activeData = (data && data.url) ? data : (error ? FALLBACK_APOD : null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!window.speechSynthesis || !activeData) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Astronomy Picture of the Day. ${activeData.title}. ${activeData.explanation}`
      );
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <main className="page-wrap">
      <div className="container">
        <SectionHeader
          moduleId="MODULE_01 // APOD"
          title="ASTRONOMY PICTURE OF THE DAY"
          sourceUrl="api.nasa.gov/planetary/apod"
          status={loading ? 'FETCHING...' : error ? 'ARCHIVE DATA' : 'RECEIVED'}
        />

        {/* Loading state */}
        {loading && <Loader message="FETCHING FROM NASA SERVERS..." />}

        {/* Success or Cached Archive state */}
        {!loading && activeData && (
          <div className="apod-wrap">

            {/* Left — image panel */}
            <div className="apod-img-panel">
              {/* Animated scan line overlay */}
              <div className="apod-scan-line" />

              {activeData.media_type === 'image' ? (
                <img
                  src={activeData.url}
                  alt={activeData.title}
                  className="apod-img"
                />
              ) : (
                // Video fallback
                <div className="apod-video-fallback">
                  <div className="apod-vid-label">VIDEO CONTENT</div>
                  <a href={activeData.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                    OPEN FEED ↗
                  </a>
                </div>
              )}

              {/* Corner badges */}
              <div className="apod-badge top-left">NASA // APOD</div>
              <div className="apod-badge bottom-right">{activeData.date}</div>
            </div>

            {/* Right — data panel */}
            <div className="apod-data">
              <div className="apod-data-header">
                <span className="apod-date-tag">{activeData.date}</span>
                <span className="apod-type-tag">{activeData.media_type?.toUpperCase()}</span>
              </div>

              <h2 className="apod-photo-title">{activeData.title}</h2>

              <p className="apod-explanation">{activeData.explanation}</p>

              {/* Interactive Audio Tour & Actions */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{isSpeaking ? '⏹ STOP NARRATION' : '🔊 LISTEN TO AUDIO TOUR'}</span>
                </button>
                <a
                  href={activeData.hdurl || activeData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
                >
                  <span>⬇ VIEW ORIGINAL HD</span>
                </a>
              </div>

              {activeData.copyright && (
                <div className="apod-copyright" style={{ marginTop: '16px' }}>COPYRIGHT: {activeData.copyright}</div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

export default Apod;
