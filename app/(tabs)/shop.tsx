import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Coins, ShoppingBag, Info } from "lucide-react-native";
import { usePlayerStore } from "@/store/player-store";
import { shopItems } from "@/data/shop-items";
import { router } from "expo-router";

interface ShopItem {
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

export default function ShopScreen() {
  const { player, buyItem } = usePlayerStore();
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!player) {
    router.replace("/character/create");
    return null;
  }

  const categories = [
    { id: "all", name: "Все" },
    { id: "weapon", name: "Оружие" },
    { id: "armor", name: "Броня" },
    { id: "potion", name: "Зелья" },
    { id: "artifact", name: "Артефакты" },
  ];

  const filteredItems = selectedCategory === "all" 
    ? shopItems 
    : shopItems.filter(item => item.type === selectedCategory);

  const handleBuy = (item: ShopItem) => {
    if (player.gold < item.price) {
      Alert.alert("Недостаточно золота", "У вас недостаточно золота для покупки этого предмета.");
      return;
    }
    
    buyItem(item);
    Alert.alert("Покупка успешна", `Вы приобрели ${item.name}!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <View style={styles.goldContainer}>
          <Coins size={20} color="#FFD700" />
          <Text style={styles.goldText}>{player.gold}</Text>
        </View>
        <TouchableOpacity 
          style={styles.inventoryButton}
          onPress={() => router.push("/inventory")}
        >
          <ShoppingBag size={20} color="#E6E1F9" />
          <Text style={styles.inventoryText}>Инвентарь</Text>
        </TouchableOpacity>
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

      <ScrollView style={styles.itemsContainer}>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemPriceContainer}>
                  <Coins size={16} color="#FFD700" />
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.buyButton,
                  player.gold < item.price && styles.buyButtonDisabled
                ]}
                onPress={() => handleBuy(item)}
                disabled={player.gold < item.price}
              >
                <Text style={styles.buyButtonText}>Купить</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.itemDescription}>
              <Text style={styles.descriptionText}>{item.description}</Text>
              
              {item.effects && item.effects.length > 0 && (
                <View style={styles.effectsContainer}>
                  <Text style={styles.effectsTitle}>Эффекты:</Text>
                  {item.effects.map((effect, index) => (
                    <View key={index} style={styles.effectItem}>
                      <Info size={14} color="#9D71EA" />
                      <Text style={styles.effectText}>{effect}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  inventoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A2D5F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inventoryText: {
    color: "#E6E1F9",
    fontSize: 14,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#2A2440",
  },
  categoryButtonActive: {
    backgroundColor: "#9D71EA",
  },
  categoryText: {
    color: "#B8B2CC",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    backgroundColor: "#2A2440",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A2D5F",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  itemPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPrice: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 4,
  },
  buyButton: {
    backgroundColor: "#9D71EA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "center",
  },
  buyButtonDisabled: {
    backgroundColor: "#3A2D5F",
    opacity: 0.7,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  itemDescription: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#B8B2CC",
    lineHeight: 20,
    marginBottom: 12,
  },
  effectsContainer: {
    marginTop: 8,
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
});