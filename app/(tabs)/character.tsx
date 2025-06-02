import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Shield, Zap, Brain, Heart, Award, Sword, ChevronRight } from "lucide-react-native";
import { usePlayerStore } from "@/store/player-store";
import { characterClasses } from "@/data/character-classes";

export default function CharacterScreen() {
  const { player, resetPlayer } = usePlayerStore();

  if (!player) {
    router.replace("/character/create");
    return null;
  }

  const playerClass = characterClasses.find(c => c.id === player.classId);

  if (!playerClass) {
    router.replace("/character/create");
    return null;
  }

  const handleViewInventory = () => {
    router.push("/inventory");
  };

  const handleViewDetails = () => {
    router.push("/character/details");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ uri: playerClass.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerClass}>{playerClass.name}</Text>
            <View style={styles.levelContainer}>
              <Award size={16} color="#9D71EA" />
              <Text style={styles.levelText}>Уровень {player.level}</Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={["#3A2D5F", "#2A2440"]}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Характеристики</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Heart size={24} color="#FF6B8A" />
              <Text style={styles.statValue}>{player.health}/{player.maxHealth}</Text>
              <Text style={styles.statLabel}>Здоровье</Text>
            </View>
            
            <View style={styles.statItem}>
              <Sword size={24} color="#FFB347" />
              <Text style={styles.statValue}>{player.attack}</Text>
              <Text style={styles.statLabel}>Атака</Text>
            </View>
            
            <View style={styles.statItem}>
              <Shield size={24} color="#4CACFF" />
              <Text style={styles.statValue}>{player.defense}</Text>
              <Text style={styles.statLabel}>Защита</Text>
            </View>
            
            <View style={styles.statItem}>
              <Brain size={24} color="#9D71EA" />
              <Text style={styles.statValue}>{player.intelligence}</Text>
              <Text style={styles.statLabel}>Интеллект</Text>
            </View>
          </View>
          
          <View style={styles.experienceContainer}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>Опыт</Text>
              <Text style={styles.experienceValue}>
                {player.experience}/{player.level * 100}
              </Text>
            </View>
            <View style={styles.experienceBarContainer}>
              <View 
                style={[
                  styles.experienceBar, 
                  { width: `${(player.experience / (player.level * 100)) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleViewInventory}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Инвентарь</Text>
              <Text style={styles.actionSubtitle}>
                {player.inventory.length} {getItemsCountText(player.inventory.length)}
              </Text>
            </View>
            <ChevronRight size={20} color="#9D71EA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleViewDetails}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Подробности</Text>
              <Text style={styles.actionSubtitle}>Способности и умения</Text>
            </View>
            <ChevronRight size={20} color="#9D71EA" />
          </TouchableOpacity>
        </View>

        <View style={styles.classInfoContainer}>
          <Text style={styles.classInfoTitle}>Класс: {playerClass.name}</Text>
          <Text style={styles.classInfoDescription}>{playerClass.description}</Text>
          
          <Text style={styles.abilitiesTitle}>Способности:</Text>
          {playerClass.abilities.map((ability, index) => (
            <View key={index} style={styles.abilityItem}>
              <Zap size={18} color="#9D71EA" />
              <View style={styles.abilityContent}>
                <Text style={styles.abilityName}>{ability.name}</Text>
                <Text style={styles.abilityDescription}>{ability.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => {
            resetPlayer();
            router.replace("/character/create");
          }}
        >
          <Text style={styles.resetButtonText}>Сбросить персонажа</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getItemsCountText(count: number): string {
  if (count === 1) return "предмет";
  if (count >= 2 && count <= 4) return "предмета";
  return "предметов";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1A2E",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#9D71EA",
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  playerClass: {
    fontSize: 16,
    color: "#B8B2CC",
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelText: {
    fontSize: 14,
    color: "#9D71EA",
    fontWeight: "600",
    marginLeft: 4,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#B8B2CC",
  },
  experienceContainer: {
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 16,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 16,
    color: "#E6E1F9",
    fontWeight: "600",
  },
  experienceValue: {
    fontSize: 14,
    color: "#9D71EA",
    fontWeight: "600",
  },
  experienceBarContainer: {
    height: 8,
    backgroundColor: "#3A2D5F",
    borderRadius: 4,
    overflow: "hidden",
  },
  experienceBar: {
    height: "100%",
    backgroundColor: "#9D71EA",
    borderRadius: 4,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#B8B2CC",
  },
  classInfoContainer: {
    backgroundColor: "#2A2440",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  classInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 8,
  },
  classInfoDescription: {
    fontSize: 16,
    color: "#B8B2CC",
    lineHeight: 24,
    marginBottom: 16,
  },
  abilitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 12,
  },
  abilityItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  abilityContent: {
    marginLeft: 12,
    flex: 1,
  },
  abilityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  abilityDescription: {
    fontSize: 14,
    color: "#B8B2CC",
    lineHeight: 20,
  },
  resetButton: {
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B8A",
    borderRadius: 12,
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#FF6B8A",
    fontSize: 16,
    fontWeight: "600",
  },
});