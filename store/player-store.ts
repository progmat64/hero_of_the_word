import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { characterClasses } from "@/data/character-classes";
import { ShopItem } from "@/data/shop-items";

export interface PlayerStats {
  battlesWon: number;
  battlesLost: number;
  wordsGuessed: number;
  hintsUsed: number;
}

export interface Player {
  name: string;
  classId: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  intelligence: number;
  gold: number;
  inventory: ShopItem[];
  equipped: ShopItem[];
  stats: PlayerStats;
}

interface PlayerState {
  player: Player | null;
  createPlayer: (data: { name: string; classId: string }) => void;
  updatePlayer: (player: Player) => void;
  resetPlayer: () => void;
  buyItem: (item: ShopItem) => void;
  sellItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      
      createPlayer: (data) => {
        const playerClass = characterClasses.find(c => c.id === data.classId);
        if (!playerClass) return;
        
        const newPlayer: Player = {
          name: data.name,
          classId: data.classId,
          level: 1,
          experience: 0,
          health: playerClass.baseHealth,
          maxHealth: playerClass.baseHealth,
          attack: playerClass.baseAttack,
          defense: playerClass.baseDefense,
          intelligence: playerClass.baseIntelligence,
          gold: 100,
          inventory: [],
          equipped: [],
          stats: {
            battlesWon: 0,
            battlesLost: 0,
            wordsGuessed: 0,
            hintsUsed: 0,
          }
        };
        
        set({ player: newPlayer });
      },
      
      updatePlayer: (player) => {
        set({ player });
      },
      
      resetPlayer: () => {
        set({ player: null });
      },
      
      buyItem: (item) => {
        const { player } = get();
        if (!player) return;
        
        const updatedPlayer = {
          ...player,
          gold: player.gold - item.price,
          inventory: [...player.inventory, item]
        };
        
        set({ player: updatedPlayer });
      },
      
      sellItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        
        const item = player.inventory.find(i => i.id === itemId);
        if (!item) return;
        
        // Remove from equipped if it's equipped
        let updatedEquipped = player.equipped;
        if (player.equipped.some(i => i.id === itemId)) {
          updatedEquipped = player.equipped.filter(i => i.id !== itemId);
        }
        
        const updatedPlayer = {
          ...player,
          gold: player.gold + Math.floor(item.price / 2),
          inventory: player.inventory.filter(i => i.id !== itemId),
          equipped: updatedEquipped
        };
        
        set({ player: updatedPlayer });
      },
      
      equipItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        
        const item = player.inventory.find(i => i.id === itemId);
        if (!item) return;
        
        // Handle potions differently - they are consumed
        if (item.type === "potion") {
          // Apply potion effects
          let updatedPlayer = {
            ...player,
            inventory: player.inventory.filter(i => i.id !== itemId)
          };
          
          // Apply different effects based on potion type
          if (item.effect === "health") {
            updatedPlayer.health = Math.min(
              updatedPlayer.maxHealth,
              updatedPlayer.health + (item.value || 0)
            );
          } else if (item.effect === "maxHealth") {
            updatedPlayer.maxHealth += (item.value || 0);
            updatedPlayer.health += (item.value || 0);
          } else if (item.effect === "attack") {
            updatedPlayer.attack += (item.value || 0);
          } else if (item.effect === "defense") {
            updatedPlayer.defense += (item.value || 0);
          } else if (item.effect === "intelligence") {
            updatedPlayer.intelligence += (item.value || 0);
          }
          
          set({ player: updatedPlayer });
          return;
        }
        
        // For equipment, check if we need to unequip something first
        let updatedEquipped = [...player.equipped];
        
        // For weapons and artifacts, only allow one of each type
        if (item.type === "weapon" || item.type === "artifact") {
          updatedEquipped = updatedEquipped.filter(i => i.type !== item.type);
        }
        
        // For armor, check the specific slot
        if (item.type === "armor" && item.slot) {
          updatedEquipped = updatedEquipped.filter(i => 
            !(i.type === "armor" && i.slot === item.slot)
          );
        }
        
        // Add the new item to equipped
        updatedEquipped.push(item);
        
        const updatedPlayer = {
          ...player,
          equipped: updatedEquipped
        };
        
        set({ player: updatedPlayer });
      },
      
      unequipItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        
        if (!player.equipped.some(i => i.id === itemId)) return;
        
        const updatedPlayer = {
          ...player,
          equipped: player.equipped.filter(i => i.id !== itemId)
        };
        
        set({ player: updatedPlayer });
      },
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);