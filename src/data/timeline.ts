// Timeline events — milestones of the relationship.
export type TimelineEvent = {
  id: string;
  title: string;
  date: string; // ISO
  description: string;
  image: string;
  emoji: string;
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: "first-text",
    title: "First Text",
    date: "2023-01-10T20:14:00",
    description:
      "A simple 'hey' that changed everything. I stared at the screen for ten minutes before typing back, trying to sound cooler than I felt. That little gray bubble with three dots is one of my favorite memories now.",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&h=400&fit=crop",
    emoji: "💬",
  },
  {
    id: "first-call",
    title: "First Call",
    date: "2023-01-22T22:30:00",
    description:
      "We said we'd talk for 'just a few minutes.' Four hours later, the sun was coming up and neither of us wanted to hang up. I knew, somewhere in that conversation, that I was in trouble — the best kind.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
    emoji: "📞",
  },
  {
    id: "first-date",
    title: "First Date",
    date: "2023-02-14T19:00:00",
    description:
      "Valentine's Day. I was so nervous I almost canceled. You walked in, smiled at me, and all my nerves melted away. We talked until the restaurant closed, walked until our feet ached, and kissed under a streetlight that felt like it was put there just for us.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad5c4c?w=600&h=400&fit=crop",
    emoji: "🌹",
  },
  {
    id: "first-photo",
    title: "First Photo Together",
    date: "2023-02-14T20:42:00",
    description:
      "A stranger offered to take our picture. We stood close, smiled too wide, and even now, looking at that photo, I can feel exactly how my heart felt in that moment — full for the first time in a long time.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop",
    emoji: "📸",
  },
  {
    id: "first-hug",
    title: "First Hug",
    date: "2023-02-14T22:10:00",
    description:
      "When I dropped you off, you turned back and hugged me before I could say goodbye. You smelled like vanilla and rain, and you held on for just a second longer than necessary. I didn't want to let go. I never do.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=400&fit=crop",
    emoji: "🤗",
  },
  {
    id: "first-kiss",
    title: "First Kiss",
    date: "2023-03-04T21:15:00",
    description:
      "Under the same streetlight as our first date, as if it was waiting for us. You tasted like coffee and mint, and you laughed against my mouth when I said 'finally.' I've never wanted to live inside a moment more than that one.",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=400&fit=crop",
    emoji: "💋",
  },
  {
    id: "anniversary",
    title: "Our Anniversary",
    date: "2024-02-14T19:00:00",
    description:
      "One year of us. We recreated our first date — same restaurant, same table, same nervous smile on my face. But this time, when you reached across for my hand, I knew it wasn't the beginning of something. It was the middle. And the middle is even better.",
    image: "https://images.unsplash.com/photo-1547126228-5ffa4b3f7b8b?w=600&h=400&fit=crop",
    emoji: "❤️",
  },
  {
    id: "first-trip",
    title: "First Trip Together",
    date: "2024-05-18T08:00:00",
    description:
      "A tiny Airbnb by the coast. We woke up to the sound of waves, made pancakes in a kitchen too small for two people, and walked the beach at sunset. You found a perfect shell and put it in my pocket like a tiny gift. I still have it.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    emoji: "✈️",
  },
  {
    id: "funny-moment",
    title: "The Karaoke Night",
    date: "2024-07-09T22:00:00",
    description:
      "We sang a duet so off-key that the entire bar clapped when we finished — partly out of mercy, partly out of respect. You laughed so hard you cried, and I fell in love with you all over again, right there, mid-chorus of a song I can't remember.",
    image: "https://images.unsplash.com/photo-1571266028243-d220c9c3b31e?w=600&h=400&fit=crop",
    emoji: "🎤",
  },
  {
    id: "future-goals",
    title: "Talking About Forever",
    date: "2024-12-31T23:59:00",
    description:
      "New Year's Eve. While the world counted down, you whispered, 'I want every new year to start with you.' I said yes before you finished the sentence. We watched the fireworks holding each other, and I knew — this is it. This is my person.",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=400&fit=crop",
    emoji: "✨",
  },
];
