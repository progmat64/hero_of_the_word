export interface Enemy {
  id: string;
  name: string;
  description: string;
  image: string;
  battleBackground: string;
  health: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  wordCategory: string;
  wordPrompt: string;
  difficulty: number;
  requiredLevel: number;
}

export const enemies: Enemy[] = [
  {
    id: "goblin",
    name: "Гоблин-словоед",
    description: "Маленький зеленый гоблин, который питается буквами и слогами.",
    image: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=500&auto=format&fit=crop",
    battleBackground: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?q=80&w=1000&auto=format&fit=crop",
    health: 50,
    attack: 8,
    defense: 5,
    expReward: 20,
    goldReward: 15,
    wordCategory: "animals",
    wordPrompt: "Угадай животное, чтобы атаковать гоблина:",
    difficulty: 1,
    requiredLevel: 1
  },
  {
    id: "skeleton",
    name: "Скелет-грамматик",
    description: "Оживший скелет, который когда-то был учителем языка.",
    image: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=500&auto=format&fit=crop",
    battleBackground: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f9?q=80&w=1000&auto=format&fit=crop",
    health: 70,
    attack: 10,
    defense: 8,
    expReward: 30,
    goldReward: 25,
    wordCategory: "professions",
    wordPrompt: "Угадай профессию, чтобы победить скелета:",
    difficulty: 2,
    requiredLevel: 2
  },
  {
    id: "troll",
    name: "Тролль-рифмоплет",
    description: "Огромный тролль, который любит загадывать сложные слова.",
    image: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?q=80&w=500&auto=format&fit=crop",
    battleBackground: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?q=80&w=1000&auto=format&fit=crop",
    health: 100,
    attack: 15,
    defense: 12,
    expReward: 50,
    goldReward: 40,
    wordCategory: "geography",
    wordPrompt: "Угадай географическое название, чтобы одолеть тролля:",
    difficulty: 3,
    requiredLevel: 3
  },
  {
    id: "witch",
    name: "Ведьма слов",
    description: "Коварная ведьма, заколдовывающая буквы и превращающая их в ядовитые зелья.",
    image: "https://images.unsplash.com/photo-1515202913167-d9a698095ebf?q=80&w=500&auto=format&fit=crop",
    battleBackground: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
    health: 85,
    attack: 12,
    defense: 10,
    expReward: 45,
    goldReward: 35,
    wordCategory: "plants",
    wordPrompt: "Угадай растение, чтобы противостоять магии ведьмы:",
    difficulty: 3,
    requiredLevel: 4
  },
  {
    id: "dragon",
    name: "Дракон-лингвист",
    description: "Древний дракон, хранитель забытых слов и редких выражений.",
    image: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?q=80&w=500&auto=format&fit=crop",
    battleBackground: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?q=80&w=1000&auto=format&fit=crop",
    health: 150,
    attack: 20,
    defense: 18,
    expReward: 100,
    goldReward: 80,
    wordCategory: "mythology",
    wordPrompt: "Угадай мифологическое существо, чтобы победить дракона:",
    difficulty: 5,
    requiredLevel: 6
  }
];