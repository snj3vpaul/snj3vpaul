/**
 * Personal/editorial content for the hybrid homepage.
 * Professional project, experience, and certification facts still live in portfolio.ts.
 * Replace diary illustrations with YOUR photos by changing each image field.
 */
export const hybridContent = {
  edition: 'NOTES ON WORK & LIFE  /  VOL. 01',
  location: 'Ottawa, Canada',
  greeting: 'Hello, I’m',
  strapline: 'Cybersecurity · FIPS 140-3 · Security assurance',
  intro: 'I’m building a career in security by combining technical curiosity, structured thinking, and real-world delivery.',
  introAside: 'A quieter personality, a curious mind, and plenty of things I care about beyond my work.',
  heroNote: 'An open notebook',
  heroNoteText: 'Good work takes patience. A good life leaves room for the unexpected.',
  journeyTitle: 'Not quite the path I imagined. Still glad I took it.',
  journey: [
    'I started in a smaller city, learning in an education system very different from the one I would later encounter in Canada.',
    'I came to Canada hoping to find my way into defensive security. Then a call from Fortinet brought me into certification and cryptographic validation. That opportunity changed the direction of my professional life.',
    'I tend to keep a low profile, but I have strong opinions and a lot of curiosity. Writing helps me make sense of both. The rest of life — sport, community, movement, cooking, travel — keeps the picture bigger than work.',
  ],
  workIntro: 'A selection of security validation programs and independent projects. Open a card to read the context, my contribution, and references.',
  diaryTitle: 'Away from the desk, life is still happening.',
  diaryIntro: 'Not everything I enjoy needs to become a professional accomplishment. Some things are worth doing simply because they matter.',
  diary: [
    { id: 'cricket', eyebrow: '01 / THE FIELD', title: 'Cricket, always.', body: 'Time on the ground with Canterbury Cricket Club, and the stories that stay long after a match.', image: '/hybrid/ground.svg', illustration: true, size: 'large', href: 'https://cricheroes.com/player-profile/21592804/Sanjeev-K-Paul/matches#STATS' },
    { id: 'travel', eyebrow: '02 / ELSEWHERE', title: 'A different view.', body: 'Travel, new places, and noticing the things that make each place its own.', image: '/hybrid/travel-window.svg', illustration: true, size: 'regular' },
    { id: 'writing', eyebrow: '03 / QUIET HOURS', title: 'Thinking out loud.', body: 'Notes, security writing, and ideas I want to understand a little better.', image: '/hybrid/notebook.svg', illustration: true, size: 'regular' },
  ],
  smallNotes: ['Football and team sport', 'Volunteering and community', 'Kettlebells for functional movement', 'Protein-focused cooking and marinade experiments'],
  writingIntro: 'Some things are better understood once you try to explain them. Research and notes from topics I keep returning to.',
  contactTitle: 'A good conversation can start anywhere.',
  contactText: 'Security validation, a project idea, cricket, or simply a thoughtful exchange — feel free to reach out.',
  resumeEnabled: false,
} as const;
