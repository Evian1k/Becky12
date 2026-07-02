// Games data — quiz questions, would-you-rather prompts, memory card sets.
export const loveQuizQuestions: { question: string; options: string[]; answer: number }[] = [
  { question: "What did we do on our first date?", options: ["Movie night", "Dinner & walk", "Coffee shop", "Concert"], answer: 1 },
  { question: "What's our song?", options: ["Perfect", "All of Me", "A Thousand Years", "All of the above"], answer: 3 },
  { question: "Where did we first say 'I love you'?", options: ["In a text", "Under a streetlight", "At a restaurant", "On a trip"], answer: 1 },
  { question: "What's my love language?", options: ["Words of affirmation", "Gifts", "Physical touch", "Quality time"], answer: 3 },
  { question: "What's my favorite way to spend a Sunday?", options: ["Brunch & walks", "Sleeping in", "Marathoning shows", "All of the above, with you"], answer: 3 },
  { question: "How do I take my coffee?", options: ["Black", "With milk", "With sugar", "Tea, actually"], answer: 1 },
  { question: "What's my dream trip?", options: ["Safari", "Tokyo", "Greek islands", "Northern lights"], answer: 3 },
];

export const wouldYouRather: { optionA: string; optionB: string }[] = [
  { optionA: "Hold hands forever", optionB: "Cuddle forever" },
  { optionA: "Travel the world together", optionB: "Build a cozy home together" },
  { optionA: "Always know what I'm thinking", optionB: "Always know what you're thinking" },
  { optionA: "Slow dance every night", optionB: "Cook dinner together every night" },
  { optionA: "Re-live our first date", optionB: "Fast-forward to our wedding" },
  { optionA: "A million dollars", optionB: "A million more days with you" },
  { optionA: "Watch the sunset together every day", optionB: "Watch the sunrise together every day" },
  { optionA: "Read each other's minds", optionB: "Feel each other's feelings" },
  { optionA: "Beach vacation", optionB: "Mountain cabin getaway" },
  { optionA: "Cook for me", optionB: "I cook for you" },
];

export const memoryGameCards = ["❤️", "💕", "💖", "💗", "💓", "💞", "💘", "💝"];

export const spinWheelOptions = [
  "Kiss 💋",
  "Hug 🤗",
  "Date night 🌹",
  "Slow dance 💃",
  "Cook together 👨‍🍳",
  "Movie marathon 🍿",
  "Stargaze ✨",
  "Write a love note 💌",
];
