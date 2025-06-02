import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Zap, Award, Sword, Shield, Brain, Heart } from "lucide-react-native";
import { usePlayerStore } from "@/store/player-store";
import { characterClasses } from "@/data/character-classes";
import { router } from "expo-router";

export default function CharacterDetailsScreen() {
  const { player } = usePlayerStore();

  if (!player) {
    router.replace("/character/create");
    return null;
  }

  const playerClass = characterClasses.find(c => c.id === player.classId);

  if (!playerClass) {
    router.replace("/character/create");
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ uri: playerClass.avatar }} 
            style={styles.avatar} 
          />
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerClass}>{playerClass.name}</Text>
          <View style={styles.levelContainer}>
            <Award size={16} color="#9D71EA" />
            <Text style={styles.levelText}>Уровень {player.level}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Характеристики</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Heart size={20} color="#FF6B8A" />
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Здоровье</Text>
                  <Text style={styles.statValue}>{player.health}/{player.maxHealth}</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Sword size={20} color="#FFB347" />
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Атака</Text>
                  <Text style={styles.statValue}>{player.attack}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Shield size={20} color="#4CACFF" />
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Защита</Text>
                  <Text style={styles.statValue}>{player.defense}</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Brain size={20} color="#9D71EA" />
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Интеллект</Text>
                  <Text style={styles.statValue}>{player.intelligence}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Прогресс</Text>
          
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Опыт</Text>
              <Text style={styles.progressValue}>
                {player.experience}/{player.level * 100}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(player.experience / (player.level * 100)) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.statsInfo}>
            <Text style={styles.statsInfoTitle}>Статистика</Text>
            <View style={styles.statsInfoRow}>
              <Text style={styles.statsInfoLabel}>Побед в битвах:</Text>
              <Text style={styles.statsInfoValue}>{player.stats.battlesWon}</Text>
            </View>
            <View style={styles.statsInfoRow}>
              <Text style={styles.statsInfoLabel}>Поражений:</Text>
              <Text style={styles.statsInfoValue}>{player.stats.battlesLost}</Text>
            </View>
            <View style={styles.statsInfoRow}>
              <Text style={styles.statsInfoLabel}>Угадано слов:</Text>
              <Text style={styles.statsInfoValue}>{player.stats.wordsGuessed}</Text>
            </View>
            <View style={styles.statsInfoRow}>
              <Text style={styles.statsInfoLabel}>Использовано подсказок:</Text>
              <Text style={styles.statsInfoValue}>{player.stats.hintsUsed}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Способности класса</Text>
          
          {playerClass.abilities.map((ability, index) => (
            <View key={index} style={styles.abilityItem}>
              <Zap size={20} color="#9D71EA" />
              <View style={styles.abilityContent}>
                <Text style={styles.abilityName}>{ability.name}</Text>
                <Text style={styles.abilityDescription}>{ability.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание класса</Text>
          <Text style={styles.classDescription}>{playerClass.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#9D71EA",
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  playerClass: {
    fontSize: 16,
    color: "#B8B2CC",
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2440",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    fontSize: 14,
    color: "#9D71EA",
    fontWeight: "600",
    marginLeft: 4,
  },
  section: {
    backgroundColor: "#2A2440",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#3A2D5F",
    borderRadius: 12,
    padding: 12,
  },
  statContent: {
    marginLeft: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#B8B2CC",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: "#E6E1F9",
  },
  progressValue: {
    fontSize: 14,
    color: "#9D71EA",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#3A2D5F",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#9D71EA",
    borderRadius: 4,
  },
  statsInfo: {
    backgroundColor: "#3A2D5F",
    borderRadius: 12,
    padding: 16,
  },
  statsInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 12,
  },
  statsInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statsInfoLabel: {
    fontSize: 14,
    color: "#B8B2CC",
  },
  statsInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E6E1F9",
  },
  abilityItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#3A2D5F",
    borderRadius: 12,
    padding: 16,
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
  classDescription: {
    fontSize: 16,
    color: "#B8B2CC",
    lineHeight: 24,
  },
});