import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Sword, Award, Zap, Sparkles } from "lucide-react-native";
import { useGameStore } from "@/store/game-store";
import { usePlayerStore } from "@/store/player-store";

export default function HomeScreen() {
  const { initialized, initGame } = useGameStore();
  const { player } = usePlayerStore();

  useEffect(() => {
    if (!initialized) {
      initGame();
    }
  }, [initialized, initGame]);

  const handleStartBattle = () => {
    if (!player) {
      router.push("/character/create");
    } else {
      router.push("/map");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1614813051323-0f71ffdd7b39?q=80&w=1000&auto=format&fit=crop" }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Виселица: Герой Слова</Text>
          <Text style={styles.subtitle}>Сражайся словами, побеждай врагов!</Text>
        </View>

        <LinearGradient
          colors={["#3A2D5F", "#2A2440"]}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Твое приключение ждет!</Text>
          <Text style={styles.cardText}>
            Отправляйся в мир, где каждое слово - оружие, а каждая буква может решить исход битвы.
          </Text>
          
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartBattle}
          >
            <LinearGradient
              colors={["#9D71EA", "#7A55C5"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {player ? "Продолжить приключение" : "Начать приключение"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.featuresTitle}>Особенности игры</Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Sword size={32} color="#9D71EA" />
            <Text style={styles.featureTitle}>Словесные сражения</Text>
            <Text style={styles.featureText}>Угадывай слова, чтобы наносить удары врагам</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Award size={32} color="#9D71EA" />
            <Text style={styles.featureTitle}>Развитие героя</Text>
            <Text style={styles.featureText}>Прокачивай навыки и находи снаряжение</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Zap size={32} color="#9D71EA" />
            <Text style={styles.featureTitle}>Уникальные способности</Text>
            <Text style={styles.featureText}>Используй особые умения своего класса</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Sparkles size={32} color="#9D71EA" />
            <Text style={styles.featureTitle}>Магические предметы</Text>
            <Text style={styles.featureText}>Собирай артефакты, дающие преимущества</Text>
          </View>
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
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E6E1F9",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#B8B2CC",
    textAlign: "center",
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: "#B8B2CC",
    lineHeight: 24,
    marginBottom: 20,
  },
  startButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
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
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#B8B2CC",
    lineHeight: 20,
  },
});