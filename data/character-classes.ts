export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  avatar: string;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  baseIntelligence: number;
  stats: Array<{ name: string; value: number }>;
  abilities: Array<{ id: string; name: string; description: string }>;
}

export const characterClasses: CharacterClass[] = [
  {
    id: "warrior",
    name: "Воин",
    description: "Мастер ближнего боя, способный выдержать больше ударов и наносить мощные атаки.",
    avatar: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=500&auto=format&fit=crop",
    baseHealth: 100,
    baseAttack: 15,
    baseDefense: 10,
    baseIntelligence: 5,
    stats: [
      { name: "Здоровье", value: 5 },
      { name: "Атака", value: 4 },
      { name: "Защита", value: 4 },
      { name: "Интеллект", value: 2 },
    ],
    abilities: [
      {
        id: "warrior_strike",
        name: "Мощный удар",
        description: "Наносит дополнительный урон врагу, игнорируя часть его защиты."
      },
      {
        id: "warrior_endurance",
        name: "Выносливость",
        description: "Позволяет выдержать на 2 ошибки больше в словесных сражениях."
      }
    ]
  },
  {
    id: "mage",
    name: "Маг",
    description: "Мудрый заклинатель, использующий силу слов для создания мощных заклинаний.",
    avatar: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=500&auto=format&fit=crop",
    baseHealth: 70,
    baseAttack: 8,
    baseDefense: 5,
    baseIntelligence: 15,
    stats: [
      { name: "Здоровье", value: 3 },
      { name: "Атака", value: 2 },
      { name: "Защита", value: 2 },
      { name: "Интеллект", value: 5 },
    ],
    abilities: [
      {
        id: "mage_reveal",
        name: "Откровение",
        description: "Открывает несколько случайных букв в загаданном слове."
      },
      {
        id: "mage_fireball",
        name: "Огненный шар",
        description: "Наносит урон, пропорциональный интеллекту мага."
      }
    ]
  },
  {
    id: "rogue",
    name: "Разбойник",
    description: "Ловкий и хитрый персонаж, способный находить слабые места противника.",
    avatar: "https://images.unsplash.com/photo-1581977012607-4091712d36f9?q=80&w=500&auto=format&fit=crop",
    baseHealth: 80,
    baseAttack: 12,
    baseDefense: 7,
    baseIntelligence: 10,
    stats: [
      { name: "Здоровье", value: 3 },
      { name: "Атака", value: 4 },
      { name: "Защита", value: 3 },
      { name: "Интеллект", value: 3 },
    ],
    abilities: [
      {
        id: "rogue_dodge",
        name: "Уклонение",
        description: "Восстанавливает часть здоровья, избегая урона от врага."
      },
      {
        id: "rogue_pickpocket",
        name: "Карманная кража",
        description: "Шанс получить дополнительное золото после победы над врагом."
      }
    ]
  }
];