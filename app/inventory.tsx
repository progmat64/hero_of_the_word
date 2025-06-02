import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sword, Shield, Gem, Info, Check, X } from "lucide-react-native";
import { usePlayerStore } from "@/store/player-store";
import { router } from "expo-router";

// Create a custom Flask icon since it's not available in lucide-react-native
const Flask = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ 
      width: size * 0.6, 
      height: size * 0.8, 
      borderRadius: size * 0.3,
      borderWidth: 2,
      borderColor: color,
      overflow: 'hidden'
    }}>
      <View style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        height: '50%', 
        backgroundColor: color,
        borderTopLeftRadius: size * 0.1,
        borderTopRightRadius: size * 0.1
      }} />
    </View>
  </View>
);

interface InventoryItem {
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

export default function InventoryScreen() {
  const { player, equipItem, unequipItem, sellItem } = usePlayerStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  if (!player) {
    router.replace("/character/create");
    return null;
  }

  const categories = [
    { id: "all", name: "Все", icon: Info },
    { id: "weapon", name: "Оружие", icon: Sword },
    { id: "armor", name: "Броня", icon: Shield },
    { id: "potion", name: "Зелья", icon: Flask },
    { id: "artifact", name: "Артефакты", icon: Gem },
  ];

  const filteredItems = selectedCategory === "all" 
    ? player.inventory 
    : player.inventory.filter(item => item.type === selectedCategory);

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const handleEquip = () => {
    if (!selectedItem) return;
    
    equipItem(selectedItem.id);
    setSelectedItem(null);
    Alert.alert("Предмет экипирован", `${selectedItem.name} теперь используется.`);
  };

  const handleUnequip = () => {
    if (!selectedItem) return;
    
    unequipItem(selectedItem.id);
    setSelectedItem(null);
    Alert.alert("Предмет снят", `${selectedItem.name} убран в инвентарь.`);
  };

  const handleSell = () => {
    if (!selectedItem) return;
    
    Alert.alert(
      "Продать предмет",
      `Вы уверены, что хотите продать ${selectedItem.name} за ${Math.floor(selectedItem.price / 2)} золота?`,
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Продать",
          onPress: () => {
            sellItem(selectedItem.id);
            setSelectedItem(null);
          }
        }
      ]
    );
  };

  const isItemEquipped = (itemId: string) => {
    return player.equipped.some(item => item.id === itemId);
  };

  const renderCategoryIcon = (category: { id: string; name: string; icon: any }) => {
    const Icon = category.icon;
    return <Icon size={20} color={selectedCategory === category.id ? "#E6E1F9" : "#8A8599"} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Инвентарь</Text>
        <View style={styles.goldContainer}>
          <Coins size={20} color="#FFD700" />
          <Text style={styles.goldText}>{player.gold}</Text>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              {renderCategoryIcon(category)}
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView style={styles.itemsContainer}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item: InventoryItem) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  selectedItem?.id === item.id && styles.selectedItemCard,
                  isItemEquipped(item.id) && styles.equippedItemCard
                ]}
                onPress={() => handleItemSelect(item)}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemType}>{getItemTypeText(item.type)}</Text>
                  {isItemEquipped(item.id) && (
                    <View style={styles.equippedBadge}>
                      <Check size={12} color="#FFFFFF" />
                      <Text style={styles.equippedText}>Экипировано</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedCategory === "all" 
                  ? "У вас нет предметов в инвентаре" 
                  : `У вас нет предметов типа "${getCategoryName(selectedCategory)}"`}
              </Text>
              <TouchableOpacity 
                style={styles.shopButton}
                onPress={() => router.push("/shop")}
              >
                <Text style={styles.shopButtonText}>Перейти в магазин</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {selectedItem && (
          <View style={styles.itemDetailsContainer}>
            <View style={styles.itemDetailsHeader}>
              <Text style={styles.itemDetailsTitle}>{selectedItem.name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedItem(null)}
              >
                <X size={20} color="#B8B2CC" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.itemDescription}>{selectedItem.description}</Text>
            
            {selectedItem.effects && selectedItem.effects.length > 0 && (
              <View style={styles.effectsContainer}>
                <Text style={styles.effectsTitle}>Эффекты:</Text>
                {selectedItem.effects.map((effect, index) => (
                  <View key={index} style={styles.effectItem}>
                    <Info size={14} color="#9D71EA" />
                    <Text style={styles.effectText}>{effect}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.itemActions}>
              {isItemEquipped(selectedItem.id) ? (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleUnequip}
                >
                  <Text style={styles.actionButtonText}>Снять</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    !canEquipItem(selectedItem, player) && styles.actionButtonDisabled
                  ]}
                  onPress={handleEquip}
                  disabled={!canEquipItem(selectedItem, player)}
                >
                  <Text style={styles.actionButtonText}>Экипировать</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.sellButton}
                onPress={handleSell}
              >
                <Text style={styles.sellButtonText}>
                  Продать ({Math.floor(selectedItem.price / 2)})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Helper functions
function getItemTypeText(type: string): string {
  switch (type) {
    case "weapon": return "Оружие";
    case "armor": return "Броня";
    case "potion": return "Зелье";
    case "artifact": return "Артефакт";
    default: return "Предмет";
  }
}

function getCategoryName(categoryId: string): string {
  switch (categoryId) {
    case "weapon": return "Оружие";
    case "armor": return "Броня";
    case "potion": return "Зелья";
    case "artifact": return "Артефакты";
    default: return "Предметы";
  }
}

function canEquipItem(item: InventoryItem, player: any): boolean {
  // Check if player already has an item of this type equipped
  if (item.type === "potion") {
    // Potions can always be used
    return true;
  }
  
  const equippedOfSameType = player.equipped.filter((equippedItem: InventoryItem) => 
    equippedItem.type === item.type
  );
  
  // For weapons and artifacts, only allow one of each type
  if ((item.type === "weapon" || item.type === "artifact") && equippedOfSameType.length > 0) {
    return false;
  }
  
  // For armor, check the specific slot
  if (item.type === "armor" && item.slot) {
    const equippedInSameSlot = player.equipped.filter((equippedItem: InventoryItem) => 
      equippedItem.type === "armor" && equippedItem.slot === item.slot
    );
    return equippedInSameSlot.length === 0;
  }
  
  return true;
}

// Import missing components
const Coins = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, borderRadius: size/2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#1E1A2E', fontSize: size/2, fontWeight: 'bold' }}>$</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1A2E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A2D5F",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  goldContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2440",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  goldText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 6,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3A2D5F",
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#2A2440",
  },
  categoryButtonActive: {
    backgroundColor: "#3A2D5F",
  },
  categoryText: {
    color: "#8A8599",
    fontSize: 14,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: "#E6E1F9",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  selectedItemCard: {
    borderColor: "#9D71EA",
    borderWidth: 2,
  },
  equippedItemCard: {
    backgroundColor: "#3A2D5F",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: "#B8B2CC",
  },
  equippedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9D71EA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: "absolute",
    right: 0,
    top: 0,
  },
  equippedText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#B8B2CC",
    textAlign: "center",
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: "#3A2D5F",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#E6E1F9",
    fontSize: 14,
    fontWeight: "600",
  },
  itemDetailsContainer: {
    backgroundColor: "#2A2440",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#3A2D5F",
  },
  itemDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemDetailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3A2D5F",
    justifyContent: "center",
    alignItems: "center",
  },
  itemDescription: {
    fontSize: 14,
    color: "#B8B2CC",
    lineHeight: 20,
    marginBottom: 12,
  },
  effectsContainer: {
    marginBottom: 16,
  },
  effectsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 8,
  },
  effectItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  effectText: {
    fontSize: 14,
    color: "#B8B2CC",
    marginLeft: 8,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#9D71EA",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  actionButtonDisabled: {
    backgroundColor: "#3A2D5F",
    opacity: 0.7,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sellButton: {
    flex: 1,
    backgroundColor: "#3A2D5F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  sellButtonText: {
    color: "#E6E1F9",
    fontSize: 16,
    fontWeight: "600",
  },
});