import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Skull, ChevronRight, Lock } from "lucide-react-native";
import { usePlayerStore } from "@/store/player-store";
import { enemies } from "@/data/enemies";

interface Enemy {
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

export default function MapScreen() {
  const { player } = usePlayerStore();
  const [selectedLocation, setSelectedLocation] = useState<Enemy | null>(null);

  if (!player) {
    router.replace("/character/create");
    return null;
  }

  const handleEnemySelect = (enemy: Enemy) => {
    setSelectedLocation(enemy);
  };

  const startBattle = () => {
    if (selectedLocation) {
      router.push(`/battle/${selectedLocation.id}`);
    }
  };

  const isLocationLocked = (enemy: Enemy) => {
    return enemy.requiredLevel > player.level;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Карта мира</Text>
        <Text style={styles.headerSubtitle}>Выбери место для сражения</Text>
      </View>

      <ScrollView style={styles.locationsContainer}>
        {enemies.map((enemy) => (
          <TouchableOpacity
            key={enemy.id}
            style={[
              styles.locationCard,
              selectedLocation?.id === enemy.id && styles.selectedLocation,
              isLocationLocked(enemy) && styles.lockedLocation,
            ]}
            onPress={() => !isLocationLocked(enemy) && handleEnemySelect(enemy)}
            disabled={isLocationLocked(enemy)}
          >
            <View style={styles.locationContent}>
              <Image source={{ uri: enemy.image }} style={styles.locationImage} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{enemy.name}</Text>
                <Text style={styles.locationDescription}>{enemy.description}</Text>
                <View style={styles.locationDetails}>
                  <View style={styles.difficultyContainer}>
                    <Text style={styles.difficultyLabel}>Сложность:</Text>
                    <View style={styles.difficultyStars}>
                      {Array(enemy.difficulty).fill(0).map((_, i) => (
                        <Skull key={i} size={14} color="#9D71EA" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.levelRequirement}>
                    Уровень: {enemy.requiredLevel}+
                  </Text>
                </View>
              </View>
              {isLocationLocked(enemy) ? (
                <Lock size={24} color="#8A8599" />
              ) : (
                <ChevronRight size={24} color="#9D71EA" />
              )}
            </View>
            {isLocationLocked(enemy) && (
              <View style={styles.lockedOverlay}>
                <Lock size={24} color="#E6E1F9" />
                <Text style={styles.lockedText}>
                  Требуется уровень {enemy.requiredLevel}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedLocation && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.battleButton} onPress={startBattle}>
            <LinearGradient
              colors={["#9D71EA", "#7A55C5"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>В бой!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1A2E",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#B8B2CC",
    marginTop: 4,
  },
  locationsContainer: {
    flex: 1,
    padding: 16,
  },
  locationCard: {
    backgroundColor: "#2A2440",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  selectedLocation: {
    borderColor: "#9D71EA",
    borderWidth: 2,
  },
  lockedLocation: {
    opacity: 0.7,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: "#B8B2CC",
    marginBottom: 8,
  },
  locationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyLabel: {
    fontSize: 12,
    color: "#8A8599",
    marginRight: 4,
  },
  difficultyStars: {
    flexDirection: "row",
  },
  levelRequirement: {
    fontSize: 12,
    color: "#9D71EA",
    fontWeight: "500",
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(30, 26, 46, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  lockedText: {
    color: "#E6E1F9",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  actionContainer: {
    padding: 16,
    backgroundColor: "#2A2440",
    borderTopWidth: 1,
    borderTopColor: "#3A2D5F",
  },
  battleButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});