// src/sections/BeyondWork.tsx
import { useState } from "react";
import { beyond } from "../data/portfolio";
import type { BeyondItem } from "../data/portfolio";

function Media({ item }: { item: BeyondItem }) {
  const [playing, setPlaying] = useState(false);
  const poster = item.video?.poster ?? item.image;

  // video, playing
  if (item.video && playing) {
    if (item.video.type === "youtube") {
      return (
        <div className="media">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.video.src}?autoplay=1&rel=0`}
            title={`${item.title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="media">
        <video src={item.video.src} poster={poster} controls autoPlay playsInline />
      </div>
    );
  }

  // video, not yet playing → poster + play button
  if (item.video) {
    return (
      <div className="media">
        {poster ? <img src={poster} alt="" /> : <div className="scan" aria-hidden="true" />}
        <button className="play" onClick={() => setPlaying(true)} aria-label={`Play ${item.title} video`}>
          <span className="disc" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // photo only
  if (item.image) {
    return (
      <div className="media">
        <img src={item.image} alt={item.title} />
        <div className="scan" aria-hidden="true" />
      </div>
    );
  }

  // graceful framed placeholder
  return (
    <div className="media placeholder">
      <div className="scan" aria-hidden="true" />
      <div className="glyph">{item.title.charAt(0)}</div>
    </div>
  );
}

function Stats({ stats }: { stats?: BeyondItem["stats"] }) {
  if (!stats?.length) return null;
  return (
    <div className="bstats">
      {stats.map((s) => (
        <div className="bstat" key={s.label}>
          <div className="v">{s.value}</div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function BeyondWork() {
  const featured = beyond.find((b) => b.featured);
  const rest = beyond.filter((b) => !b.featured);

  return (
    <section id="beyond">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">06</span> Beyond work
          </div>
          <h2 className="title">More than the work — the habits that shape how I deliver.</h2>
        </div>

        {featured && (
          <div className="beyond-featured reveal">
            <Media item={featured} />
            <div className="bf-content">
              <div className="ic">{featured.kind}</div>
              <h3>{featured.title}</h3>
              <p>{featured.blurb}</p>
              <Stats stats={featured.stats} />
            </div>
          </div>
        )}

        <div className="beyond stagger">
          {rest.map((b) => (
            <div className="bcard" key={b.title}>
              <div className="ic">{b.kind}</div>
              <h4>{b.title}</h4>
              <p>{b.blurb}</p>
              <Stats stats={b.stats} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}