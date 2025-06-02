export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  image: string;
  effects: string[];
  stats?: Record<string, number>;
  effect?: string;
  value?: number;
  slot?: string;
}

export const shopItems: ShopItem[] = [
  // Weapons
  {
    id: "sword_basic",
    name: "Железный меч",
    description: "Простой, но надежный меч для начинающих героев.",
    type: "weapon",
    price: 100,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+5 к атаке"],
    stats: { attack: 5 }
  },
  {
    id: "sword_silver",
    name: "Серебряный меч",
    description: "Изящный меч, наносящий дополнительный урон нежити.",
    type: "weapon",
    price: 250,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+10 к атаке", "Дополнительный урон нежити"],
    stats: { attack: 10 }
  },
  {
    id: "staff_magic",
    name: "Магический посох",
    description: "Древний посох, усиливающий магические способности.",
    type: "weapon",
    price: 300,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+5 к атаке", "+8 к интеллекту"],
    stats: { attack: 5, intelligence: 8 }
  },
  
  // Armor
  {
    id: "armor_leather",
    name: "Кожаная броня",
    description: "Легкая броня, обеспечивающая базовую защиту.",
    type: "armor",
    slot: "body",
    price: 120,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+5 к защите"],
    stats: { defense: 5 }
  },
  {
    id: "armor_chain",
    name: "Кольчуга",
    description: "Прочная кольчужная броня для серьезной защиты.",
    type: "armor",
    slot: "body",
    price: 280,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+12 к защите", "-1 к скорости"],
    stats: { defense: 12 }
  },
  {
    id: "helmet_iron",
    name: "Железный шлем",
    description: "Надежный шлем, защищающий голову от ударов.",
    type: "armor",
    slot: "head",
    price: 150,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+6 к защите"],
    stats: { defense: 6 }
  },
  
  // Potions
  {
    id: "potion_health",
    name: "Зелье здоровья",
    description: "Восстанавливает 30 очков здоровья при использовании.",
    type: "potion",
    effect: "health",
    value: 30,
    price: 50,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["Восстанавливает 30 HP"]
  },
  {
    id: "potion_strength",
    name: "Зелье силы",
    description: "Навсегда увеличивает атаку на 2 очка.",
    type: "potion",
    effect: "attack",
    value: 2,
    price: 200,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["Постоянно +2 к атаке"]
  },
  {
    id: "potion_intelligence",
    name: "Зелье мудрости",
    description: "Навсегда увеличивает интеллект на 2 очка.",
    type: "potion",
    effect: "intelligence",
    value: 2,
    price: 200,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["Постоянно +2 к интеллекту"]
  },
  
  // Artifacts
  {
    id: "ring_knowledge",
    name: "Кольцо знаний",
    description: "Древнее кольцо, дающее подсказку в начале каждого боя.",
    type: "artifact",
    price: 350,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["Открывает 1 букву в начале боя", "+3 к интеллекту"],
    stats: { intelligence: 3 }
  },
  {
    id: "amulet_life",
    name: "Амулет жизни",
    description: "Защитный амулет, увеличивающий максимальное здоровье.",
    type: "artifact",
    price: 400,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+20 к максимальному здоровью"],
    stats: { maxHealth: 20 }
  },
  {
    id: "gloves_dexterity",
    name: "Перчатки ловкости",
    description: "Магические перчатки, позволяющие делать на одну ошибку больше в бою.",
    type: "artifact",
    price: 450,
    image: "https://images.unsplash.com/photo-1589418763978-4be14c0a317d?q=80&w=500&auto=format&fit=crop",
    effects: ["+1 дополнительная попытка в бою", "+4 к защите"],
    stats: { defense: 4 }
  }
];