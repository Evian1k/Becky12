// Gallery photos — replace with real photos in /public/gallery/.
export type GalleryPhoto = {
  id: string;
  src: string;
  caption: string;
  category: "Selfies" | "Adventures" | "Funny Moments" | "Dates" | "Random";
  width: number; // for masonry sizing hints
  height: number;
};

export const galleryCategories = [
  "All",
  "Selfies",
  "Adventures",
  "Funny Moments",
  "Dates",
  "Random",
] as const;

export const galleryPhotos: GalleryPhoto[] = [
  { id: "g1", src: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=800&fit=crop", caption: "The look that started it all", category: "Selfies", width: 600, height: 800 },
  { id: "g2", src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop", caption: "Lost in the city, found in you", category: "Adventures", width: 600, height: 400 },
  { id: "g3", src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&h=600&fit=crop", caption: "Caught mid-laugh", category: "Funny Moments", width: 600, height: 600 },
  { id: "g4", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad5c4c?w=600&h=800&fit=crop", caption: "First date energy", category: "Dates", width: 600, height: 800 },
  { id: "g5", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop", caption: "Us, always", category: "Selfies", width: 600, height: 600 },
  { id: "g6", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", caption: "Coastal escape", category: "Adventures", width: 600, height: 400 },
  { id: "g7", src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop", caption: "The best hugs", category: "Random", width: 600, height: 800 },
  { id: "g8", src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop", caption: "Coffee + you = perfect morning", category: "Dates", width: 600, height: 400 },
  { id: "g9", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop", caption: "Goofballs forever", category: "Funny Moments", width: 600, height: 800 },
  { id: "g10", src: "https://images.unsplash.com/photo-1503516459261-40c66117780a?w=600&h=600&fit=crop", caption: "Sunset chasing", category: "Adventures", width: 600, height: 600 },
  { id: "g11", src: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&h=400&fit=crop", caption: "That smile though", category: "Selfies", width: 600, height: 400 },
  { id: "g12", src: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=600&h=600&fit=crop", caption: "Date night vibes", category: "Dates", width: 600, height: 600 },
  { id: "g13", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop", caption: "Random cute moment", category: "Random", width: 600, height: 800 },
  { id: "g14", src: "https://images.unsplash.com/photo-1529397989211-5381bd6dec44?w=600&h=400&fit=crop", caption: "On the road again", category: "Adventures", width: 600, height: 400 },
  { id: "g15", src: "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&h=600&fit=crop", caption: "Just us being us", category: "Funny Moments", width: 600, height: 600 },
  { id: "g16", src: "https://images.unsplash.com/photo-1526413232644-8a68f38703bc?w=600&h=800&fit=crop", caption: "Golden hour", category: "Selfies", width: 600, height: 800 },
  { id: "g17", src: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=400&fit=crop", caption: "A perfect evening", category: "Dates", width: 600, height: 400 },
  { id: "g18", src: "https://images.unsplash.com/photo-1503925802536-c9451dcd87b5?w=600&h=600&fit=crop", caption: "Caught off guard", category: "Random", width: 600, height: 600 },
];
