import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, Check } from "lucide-react-native";
import { usePlayerStore } from "@/store/player-store";
import { characterClasses } from "@/data/character-classes";

export default function CreateCharacterScreen() {
  const { createPlayer } = usePlayerStore();
  const [name, setName] = useState("");
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [nameError, setNameError] = useState("");

  const selectedClass = characterClasses[selectedClassIndex];

  const handlePrevClass = () => {
    setSelectedClassIndex(prev => 
      prev === 0 ? characterClasses.length - 1 : prev - 1
    );
  };

  const handleNextClass = () => {
    setSelectedClassIndex(prev => 
      prev === characterClasses.length - 1 ? 0 : prev + 1
    );
  };

  const handleCreateCharacter = () => {
    if (!name.trim()) {
      setNameError("Введите имя героя");
      return;
    }
    
    createPlayer({
      name: name.trim(),
      classId: selectedClass.id,
    });
    
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Создание героя</Text>
        <Text style={styles.subtitle}>
          Выбери класс и имя для своего героя
        </Text>

        <View style={styles.nameInputContainer}>
          <Text style={styles.inputLabel}>Имя героя</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Введите имя"
            placeholderTextColor="#8A8599"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError("");
            }}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>Выбери класс</Text>

        <View style={styles.classSelector}>
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handlePrevClass}
          >
            <ChevronLeft size={24} color="#9D71EA" />
          </TouchableOpacity>
          
          <View style={styles.classCard}>
            <Image 
              source={{ uri: selectedClass.avatar }} 
              style={styles.classImage} 
            />
            <Text style={styles.className}>{selectedClass.name}</Text>
            <Text style={styles.classDescription}>
              {selectedClass.description}
            </Text>
            
            <View style={styles.statsContainer}>
              {selectedClass.stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statName}>{stat.name}</Text>
                  <View style={styles.statBarContainer}>
                    <View 
                      style={[
                        styles.statBar, 
                        { width: `${stat.value * 20}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
            
            <Text style={styles.abilitiesTitle}>Способности:</Text>
            {selectedClass.abilities.map((ability, index) => (
              <View key={index} style={styles.abilityItem}>
                <Text style={styles.abilityName}>{ability.name}</Text>
                <Text style={styles.abilityDescription}>
                  {ability.description}
                </Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.arrowButton} 
            onPress={handleNextClass}
          >
            <ChevronRight size={24} color="#9D71EA" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreateCharacter}
        >
          <LinearGradient
            colors={["#9D71EA", "#7A55C5"]}
            style={styles.buttonGradient}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Создать героя</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E6E1F9",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#B8B2CC",
    textAlign: "center",
    marginBottom: 24,
  },
  nameInputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "#E6E1F9",
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 16,
    color: "#E6E1F9",
    fontSize: 16,
  },
  errorText: {
    color: "#FF6B8A",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 16,
  },
  classSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2440",
    justifyContent: "center",
    alignItems: "center",
  },
  classCard: {
    flex: 1,
    backgroundColor: "#2A2440",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 12,
  },
  classImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#9D71EA",
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E6E1F9",
    textAlign: "center",
    marginBottom: 8,
  },
  classDescription: {
    fontSize: 14,
    color: "#B8B2CC",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statItem: {
    marginBottom: 8,
  },
  statName: {
    fontSize: 14,
    color: "#E6E1F9",
    marginBottom: 4,
  },
  statBarContainer: {
    height: 8,
    backgroundColor: "#3A2D5F",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    backgroundColor: "#9D71EA",
    borderRadius: 4,
  },
  abilitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 12,
  },
  abilityItem: {
    marginBottom: 12,
  },
  abilityName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  abilityDescription: {
    fontSize: 14,
    color: "#B8B2CC",
    lineHeight: 20,
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  buttonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});