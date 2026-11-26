import { personalStory } from "../data/portfolio";

export default function MyStory() {
  return (
    <section id="story" className="editorial-story" aria-labelledby="story-title">
      <div className="wrap editorial-story-grid">
        <div>
          <div className="eyebrow">The journey, so far</div>
          <h2 className="title" id="story-title">Not a straight line. And that's the point.</h2>
        </div>
        <div className="story-prose">
          {personalStory.paragraphs.map((text) => <p key={text}>{text}</p>)}
          <p className="story-signoff">{personalStory.signoff}</p>
        </div>
      </div>
    </section>
  );
}
