// Love letters — each opens with an envelope animation.
export type LoveLetter = {
  id: string;
  recipient: string;
  date: string;
  signature: string;
  preview: string;
  body: string[];
};

export const loveLetters: LoveLetter[] = [
  {
    id: "letter-1",
    recipient: "My Love,",
    date: "February 14, 2024",
    signature: "Forever yours,",
    preview: "On our first anniversary...",
    body: [
      "On our first anniversary, I find myself sitting here trying to put into words something that doesn't fit in words.",
      "A year ago, you walked into my life — or maybe I should say, you walked into my life properly, because the truth is, you'd been there in the background for a long time, waiting patiently for me to notice. And when I finally did, it was like seeing the sun for the first time after a long, dark winter.",
      "You have changed me in ways you'll never fully understand. You've made me softer and stronger at the same time. You've shown me what love is supposed to feel like — not the anxious, doubtful, anxious kind I'd known before, but the steady, certain, sure kind. The kind that doesn't ask for proof because it knows.",
      "I love the way you laugh at your own jokes before you finish telling them. I love the way you hum when you're focused. I love the way you reach for my hand without thinking, like it's the most natural thing in the world. I love the way you say 'good morning' and mean it. I love every single version of you — the sleepy one, the cranky one, the dancing-in-the-kitchen one, the crying-during-movies one. All of them. Always.",
      "Thank you for choosing me. Thank you for keeping me. Thank you for being the answer to a question I didn't even know I was asking.",
      "Here's to a year of us. And to a hundred more. And to a hundred after that.",
    ],
  },
  {
    id: "letter-2",
    recipient: "To the one I love most,",
    date: "A random Tuesday",
    signature: "Yours, completely.",
    preview: "Just because...",
    body: [
      "There's no special occasion today. No anniversary, no birthday, no milestone. Just a regular Tuesday, and you sitting across from me reading something on your phone, and me realizing — suddenly, completely — that I am the luckiest person alive.",
      "I don't tell you often enough how much I love the ordinary moments with you. The way we share silence. The way we share snacks. The way you steal my fries and pretend you didn't. The way you fall asleep on my shoulder during movies and wake up pretending you were awake the whole time.",
      "These are the moments I'll remember when we're old. Not the big trips or the fancy dates — though I love those too — but this. Right now. You, in sweatpants, with your hair up, reading your phone, completely unaware that I'm writing you a love letter in my head.",
      "I love you. That's it. That's the whole letter.",
    ],
  },
  {
    id: "letter-3",
    recipient: "My forever person,",
    date: "The day I knew",
    signature: "Always, me.",
    preview: "The moment I knew...",
    body: [
      "People always ask when you know. They make it sound like a lightning bolt — sudden, dramatic, cinematic. But for me, it was quieter than that.",
      "It was a Wednesday. You were telling me about your day — something annoying a coworker said, something funny that happened on the way home, something you wanted to make for dinner. You were pacing the kitchen while you talked, gesturing wildly, and at some point you stopped, looked at me, and said, 'Sorry, am I talking too much?'",
      "And in that instant, I knew. I knew I could listen to you talk for the rest of my life and never get tired of it. I knew I wanted to be the person you came home to. I knew I wanted to know what annoyed you at work and what made you laugh on the way home and what you wanted to make for dinner, every single day, forever.",
      "I didn't say any of that, of course. I just said, 'Never. You could never talk too much.' And you smiled at me, a little puzzled, a little pleased, and went back to your story.",
      "But I knew. And I've known every day since.",
      "I love you. I will love you on every Wednesday for the rest of my life.",
    ],
  },
];
