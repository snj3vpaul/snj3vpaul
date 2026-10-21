/**
 * Personal/editorial content for the hybrid homepage.
 * Professional project, experience, and certification facts still live in portfolio.ts.
 * Replace diary illustrations with YOUR photos by changing each image field.
 */
export const hybridContent = {
  edition: 'NOTES ON WORK & LIFE  /  VOL. 01',
  location: 'Ottawa, Canada',
  greeting: 'Hello, I’m',
  
strapline:
  'Security assurance · FIPS 140-3 · Technical delivery',

intro:
  'I connect security requirements with real-world delivery — from FIPS 140-3 analysis and validation evidence to the people and processes that move certification work forward.',

introAside:
  'Rooted in technical analysis, growing through cross-team delivery. Quiet by nature, curious well beyond work.',

  heroNote: 'An open notebook',
  heroNoteText: 'Good work takes patience. A good life leaves room for the unexpected.',
  journeyTitle: 'Not quite the path I imagined. Still glad I took it.',
  journey: [
    'I started in a smaller city, learning in an education system very different from the one I would later encounter in Canada.',
    'I came to Canada hoping to find my way into defensive security. Then a call from Fortinet brought me into certification and cryptographic validation. That opportunity changed the direction of my professional life.',
    'I tend to keep a low profile, but I have strong opinions and a lot of curiosity. Writing helps me make sense of both. The rest of life — sport, community, movement, cooking, travel — keeps the picture bigger than work.',
  ],
  
workIntro:
  'Selected certification work and independent projects — what the work involved, where I contributed, and what can be verified publicly.',

  
practiceTitle: 'Where analysis meets execution.',

practiceIntro:
  'My foundation is security assurance. The next step is deeper technical judgment and wider responsibility for delivery — not a title for its own sake.',

practice: [
  {
    label: 'TECHNICAL ANALYSIS',
    title: 'Understand the security question.',
    description:
      'Translate validation requirements into focused reviews, practical checks, and evidence that can be examined.',
    skills: [
      'FIPS 140-3',
      'Cryptographic boundary scoping',
      'Approved-mode behavior',
      'Technical evidence',
    ],
  },
  {
    label: 'CERTIFICATION DELIVERY',
    title: 'Keep the right people aligned.',
    description:
      'Support the work between engineering, QA, documentation, and external reviewers across certification cycles.',
    skills: [
      'Cross-team coordination',
      'Review findings',
      'Documentation',
      'Common Criteria workflows',
    ],
  },
  {
    label: 'INDEPENDENT INITIATIVE',
    title: 'Build things beyond my day job.',
    description:
      'Take an idea through implementation and iteration, and learn from the details that only become visible when something ships.',
    skills: [
      'React',
      'Structured content',
      'Input handling',
      'Web delivery',
    ],
  },
],

nextChapter: {
  label: 'WHAT COMES NEXT',
  title: 'More depth. Broader ownership.',
  text:
    'I want to keep growing at the intersection of security assurance, technical analysis, and certification delivery — taking on more complex work and greater responsibility for bringing people and evidence together. Leadership, to me, starts with sound judgment and dependable follow-through.',
},

  diaryTitle: 'Away from the desk, life is still happening.',
  diaryIntro: 'Not everything I enjoy needs to become a professional accomplishment. Some things are worth doing simply because they matter.',
  diary: [
    { id: 'cricket', eyebrow: '01 / THE FIELD', title: 'Cricket, always.', body: 'Time on the ground with Canterbury Cricket Club, and the stories that stay long after a match.', image: '/hybrid/ground.svg', illustration: true, size: 'large', href: 'https://cricheroes.com/player-profile/21592804/Sanjeev-K-Paul/matches#STATS' },
    { id: 'travel', eyebrow: '02 / ELSEWHERE', title: 'A different view.', body: 'Travel, new places, and noticing the things that make each place its own.', image: '/hybrid/travel-window.svg', illustration: true, size: 'regular' },
    { id: 'writing', eyebrow: '03 / QUIET HOURS', title: 'Thinking out loud.', body: 'Notes, security writing, and ideas I want to understand a little better.', image: '/hybrid/notebook.svg', illustration: true, size: 'regular' },
  ],
  smallNotes: ['Football and team sport', 'Volunteering and community', 'Kettlebells for functional movement', 'Protein-focused cooking and marinade experiments'],
  kitchenTitle: 'A little experimentation, away from the keyboard.',
  kitchenText: 'I enjoy protein-focused cooking, especially figuring out how a different marinade can change a familiar dish. No elaborate food blog here — just another way I like to experiment.',
  writingIntro: 'Some things are better understood once you try to explain them. Research and notes from topics I keep returning to.',
  contactTitle: "That's me, in a few scrolls.",

  contactText:
  "I've shared a little about the work I do, the things I'm learning, and what keeps me occupied beyond a screen.",

  contactInvitation:
  "If something caught your attention — whether it's security, a project you're building, or cricket — I'd be glad to hear your perspective.",

  contactSignoff:
  "I don't always have the answers. I usually have questions.",

  resumeEnabled: true,
} as const;
