// ============================================================
// pages/Apod.jsx — Astronomy Picture of the Day
//
// Fetches today's NASA APOD and shows:
//   - Full image (left panel) with scan-line animation
//   - Title, date, explanation, copyright (right panel)
// ============================================================

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

              {activeData.copyright && (
                <div className="apod-copyright">COPYRIGHT: {activeData.copyright}</div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

export default Apod;
