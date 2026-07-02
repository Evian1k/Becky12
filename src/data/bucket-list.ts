// Bucket list — interactive checklist with completion animations.
export type BucketItem = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
};

export const bucketList: BucketItem[] = [
  { id: "b1", title: "Visit Diani Beach", description: "White sand, turquoise water, you in a sun hat. We'll watch the sun set into the Indian Ocean.", emoji: "🏖️", category: "Travel" },
  { id: "b2", title: "Travel somewhere new together", description: "Throw a dart at a map. Go. Get lost. Find ourselves.", emoji: "🌍", category: "Travel" },
  { id: "b3", title: "Watch the sunrise", description: "Wake up early enough to watch the sky turn pink. Bring coffee. Bring blankets. Bring you.", emoji: "🌅", category: "Moments" },
  { id: "b4", title: "Go camping", description: "Tent, campfire, stars, no phones. Just us and the sound of the world settling down for the night.", emoji: "🏕️", category: "Adventures" },
  { id: "b5", title: "Take matching photos", description: "Same outfit, same pose, same place — but every year, on the same date. Watch us grow old together.", emoji: "📸", category: "Moments" },
  { id: "b6", title: "Road trip", description: "No destination. Just snacks, playlists, and the open road. We'll figure out where we're going when we get there.", emoji: "🚗", category: "Adventures" },
  { id: "b7", title: "Watch the stars", description: "Drive somewhere dark enough to see the Milky Way. Lie on the hood of the car. Hold hands. Be small together under something huge.", emoji: "✨", category: "Moments" },
  { id: "b8", title: "Cook a meal together", description: "From scratch. With wine. With music. With way too many taste-tests and a kitchen that's a disaster by the end.", emoji: "🍝", category: "Moments" },
  { id: "b9", title: "Dance in the rain", description: "When the next warm summer storm hits, we're going outside. No umbrellas. Just us, soaked, laughing, dancing to no music.", emoji: "🌧️", category: "Moments" },
  { id: "b10", title: "Write each other a real letter", description: "Pen, paper, envelopes, stamps. The old-fashioned way. We'll seal them and not open them for ten years.", emoji: "💌", category: "Moments" },
  { id: "b11", title: "Take a cooking class", description: "Learn to make pasta in Italy. Or sushi in Japan. Or tacos in Mexico. Or just bread in our own kitchen.", emoji: "👨‍🍳", category: "Learn" },
  { id: "b12", title: "Plant a tree together", description: "Something we can visit in fifty years and say, 'We planted that. The same year we planted us.'", emoji: "🌳", category: "Future" },
  { id: "b13", title: "See the Northern Lights", description: "Iceland, Norway, somewhere far north and very cold. We'll hold each other and watch the sky do impossible things.", emoji: "🌌", category: "Travel" },
  { id: "b14", title: "Ride a hot air balloon", description: "At sunrise. Over something beautiful. Holding hands six thousand feet in the air.", emoji: "🎈", category: "Adventures" },
  { id: "b15", title: "Build a blanket fort", description: "Like we're kids. With fairy lights and snacks and a movie on a laptop. Sometimes the simplest things are the most magical.", emoji: "🏕️", category: "Moments" },
  { id: "b16", title: "Slow dance in the kitchen", description: "Just because a song we love came on. No occasion. No audience. Just us.", emoji: "💃", category: "Moments" },
];
