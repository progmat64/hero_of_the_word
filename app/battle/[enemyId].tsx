import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { Heart, Zap, Brain, Lightbulb, Sword } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { usePlayerStore } from "@/store/player-store";
import { useBattleStore } from "@/store/battle-store";
import { enemies } from "@/data/enemies";
import { characterClasses } from "@/data/character-classes";


import { wordCategories } from "@/data/words";

const ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

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

interface BattleResult {
  victory: boolean;
  expGained?: number;
  goldGained?: number;
  levelUp?: boolean;
  healthLost?: number;
}

interface Ability {
  id: string;
  name: string;
  description: string;
}

export default function BattleScreen() {
  const { enemyId } = useLocalSearchParams();
  const { player, updatePlayer } = usePlayerStore();
  const { 
    currentWord, 
    guessedLetters, 
    wrongGuesses, 
    initBattle, 
    guessLetter, 
    useHint,
    isWordGuessed,
    resetBattle
  } = useBattleStore();
  
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [playerHealth, setPlayerHealth] = useState(player?.health || 0);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [showAbilityMenu, setShowAbilityMenu] = useState(false);
  const [abilityUsed, setAbilityUsed] = useState(false);
  
  const playerClass = player ? characterClasses.find(c => c.id === player.classId) : null;

  useEffect(() => {
    if (!player) {
      router.replace("/character/create");
      return;
    }
    
    const foundEnemy = enemies.find(e => e.id === enemyId);
    if (!foundEnemy) {
      router.back();
      return;
    }
    
    setEnemy(foundEnemy);
    setEnemyHealth(foundEnemy.health);
    
    // Initialize battle with a word from the enemy's category
    const category = wordCategories.find(c => c.id === foundEnemy.wordCategory);
    if (category) {
      initBattle(category.words);
    }
    
    return () => {
      resetBattle();
    };
  }, [enemyId, player]);

  useEffect(() => {
    if (isWordGuessed && enemy) {
      handleWordGuessed();
    }
  }, [isWordGuessed, enemy]);

  useEffect(() => {
    if (wrongGuesses >= 6 && enemy) {
      handlePlayerLost();
    }
  }, [wrongGuesses, enemy]);

  const handleWordGuessed = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (!player || !enemy) return;
    
    // Calculate damage to enemy
    const damage = player.attack + (player.intelligence * 0.5);
    const newEnemyHealth = Math.max(0, enemyHealth - damage);
    setEnemyHealth(newEnemyHealth);
    
    if (newEnemyHealth <= 0) {
      handleEnemyDefeated();
    } else {
      // Continue battle with a new word
      const category = wordCategories.find(c => c.id === enemy.wordCategory);
      if (category) {
        initBattle(category.words);
      }
    }
  };

  const handleEnemyDefeated = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (!player || !enemy) return;
    
    // Calculate rewards
    const expGain = enemy.expReward;
    const goldGain = enemy.goldReward;
    
    // Update player stats
    const updatedPlayer = {
      ...player,
      experience: player.experience + expGain,
      gold: player.gold + goldGain,
      health: playerHealth,
      stats: {
        ...player.stats,
        battlesWon: player.stats.battlesWon + 1,
        wordsGuessed: player.stats.wordsGuessed + 1,
      }
    };
    
    // Check for level up
    if (updatedPlayer.experience >= updatedPlayer.level * 100) {
      updatedPlayer.level += 1;
      updatedPlayer.maxHealth += 10;
      updatedPlayer.health = updatedPlayer.maxHealth;
      updatedPlayer.attack += 2;
      updatedPlayer.defense += 2;
      updatedPlayer.intelligence += 1;
    }
    
    updatePlayer(updatedPlayer);
    
    setBattleResult({
      victory: true,
      expGained: expGain,
      goldGained: goldGain,
      levelUp: updatedPlayer.level > player.level
    });
  };

  const handlePlayerLost = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    
    if (!player) return;
    
    // Update player stats
    const updatedPlayer = {
      ...player,
      health: Math.max(1, player.health - 20),
      stats: {
        ...player.stats,
        battlesLost: player.stats.battlesLost + 1,
      }
    };
    
    updatePlayer(updatedPlayer);
    
    setBattleResult({
      victory: false,
      healthLost: 20,
    });
  };

  const handleLetterPress = (letter: string) => {
    if (battleResult) return;
    
    Haptics.selectionAsync();
    
    const result = guessLetter(letter);
    
    if (!result.correct && enemy && player) {
      // Player takes damage on wrong guess
      const damage = Math.max(1, Math.floor(enemy.attack - player.defense * 0.5));
      const newHealth = Math.max(0, playerHealth - damage);
      setPlayerHealth(newHealth);
      
      if (newHealth <= 0) {
        handlePlayerLost();
      }
    }
  };

  const handleUseHint = () => {
    if (!player) return;
    
    if (player.intelligence < 3) {
      Alert.alert("Недостаточно интеллекта", "Для использования подсказки требуется минимум 3 интеллекта.");
      return;
    }
    
    Haptics.selectionAsync();
    
    const hintResult = useHint();
    if (hintResult.success) {
      // Update player stats
      const updatedPlayer = {
        ...player,
        stats: {
          ...player.stats,
          hintsUsed: player.stats.hintsUsed + 1,
        }
      };
      updatePlayer(updatedPlayer);
    }
  };

  const handleUseAbility = (ability: Ability) => {
    if (!player || !enemy) return;
    
    Haptics.selectionAsync();
    setShowAbilityMenu(false);
    setAbilityUsed(true);
    
    // Implement ability effects based on class
    switch (ability.id) {
      case "warrior_strike":
        // Warrior deals extra damage
        const damage = player.attack * 1.5;
        const newEnemyHealth = Math.max(0, enemyHealth - damage);
        setEnemyHealth(newEnemyHealth);
        
        if (newEnemyHealth <= 0) {
          handleEnemyDefeated();
        }
        break;
        
      case "mage_reveal":
        // Mage reveals multiple letters
        for (let i = 0; i < 3; i++) {
          useHint();
        }
        break;
        
      case "rogue_dodge":
        // Rogue recovers health
        const healAmount = Math.floor(player.maxHealth * 0.3);
        const newHealth = Math.min(player.maxHealth, playerHealth + healAmount);
        setPlayerHealth(newHealth);
        break;
    }
  };

  const handleContinue = () => {
    router.back();
  };

  const renderWord = () => {
    if (!currentWord) return null;
    
    return (
      <View style={styles.wordContainer}>
        {currentWord.split("").map((letter, index) => (
          <View key={index} style={styles.letterContainer}>
            {guessedLetters.includes(letter.toUpperCase()) ? (
              <Text style={styles.letter}>{letter.toUpperCase()}</Text>
            ) : (
              <Text style={styles.letterPlaceholder}>_</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderKeyboard = () => {
    return (
      <View style={styles.keyboardContainer}>
        {ALPHABET.split("").map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[
              styles.keyboardButton,
              guessedLetters.includes(letter) && styles.keyboardButtonDisabled
            ]}
            onPress={() => handleLetterPress(letter)}
            disabled={guessedLetters.includes(letter) || battleResult !== null}
          >
            <Text style={styles.keyboardButtonText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHealthBar = (current: number, max: number, color: string) => {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));
    
    return (
      <View style={styles.healthBarContainer}>
        <View style={[styles.healthBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };

  if (!enemy || !player || !currentWord) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {battleResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            {battleResult.victory ? "Победа!" : "Поражение!"}
          </Text>
          
          {battleResult.victory ? (
            <View style={styles.rewardsContainer}>
              <Image 
                source={{ uri: enemy.image }} 
                style={styles.enemyImageSmall} 
              />
              <Text style={styles.resultText}>
                Вы победили {enemy.name}!
              </Text>
              
              <View style={styles.rewardItem}>
                <Zap size={20} color="#FFD700" />
                <Text style={styles.rewardText}>
                  +{battleResult.expGained} опыта
                </Text>
              </View>
              
              <View style={styles.rewardItem}>
                <Coins size={20} color="#FFD700" />
                <Text style={styles.rewardText}>
                  +{battleResult.goldGained} золота
                </Text>
              </View>
              
              {battleResult.levelUp && (
                <View style={styles.levelUpContainer}>
                  <Award size={24} color="#9D71EA" />
                  <Text style={styles.levelUpText}>
                    Уровень повышен до {player.level}!
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.defeatContainer}>
              <Image 
                source={{ uri: enemy.image }} 
                style={styles.enemyImageSmall} 
              />
              <Text style={styles.resultText}>
                {enemy.name} победил вас!
              </Text>
              <Text style={styles.defeatText}>
                Вы потеряли {battleResult.healthLost} здоровья.
              </Text>
              <Text style={styles.defeatHint}>
                Попробуйте улучшить снаряжение или повысить уровень.
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={["#9D71EA", "#7A55C5"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Продолжить</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.battleContent}>
          <View style={styles.battleHeader}>
            <View style={styles.playerInfo}>
              {playerClass && (
                <Image 
                  source={{ uri: playerClass.avatar }} 
                  style={styles.playerAvatar} 
                />
              )}
              <View style={styles.playerStats}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.healthContainer}>
                  <Heart size={16} color="#FF6B8A" />
                  <Text style={styles.healthText}>
                    {playerHealth}/{player.maxHealth}
                  </Text>
                </View>
                {renderHealthBar(playerHealth, player.maxHealth, "#FF6B8A")}
              </View>
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            
            <View style={styles.enemyInfo}>
              <View style={styles.enemyStats}>
                <Text style={styles.enemyName}>{enemy.name}</Text>
                <View style={styles.healthContainer}>
                  <Heart size={16} color="#FF6B8A" />
                  <Text style={styles.healthText}>
                    {enemyHealth}/{enemy.health}
                  </Text>
                </View>
                {renderHealthBar(enemyHealth, enemy.health, "#FF6B8A")}
              </View>
              <Image 
                source={{ uri: enemy.image }} 
                style={styles.enemyAvatar} 
              />
            </View>
          </View>
          
          <View style={styles.battleScene}>
            <Image 
              source={{ uri: enemy.battleBackground }} 
              style={styles.battleBackground} 
            />
            <View style={styles.battleOverlay}>
              <View style={styles.hangmanContainer}>
                <Image 
                  source={{ uri: `https://images.unsplash.com/photo-1614813051323-0f71ffdd7b39?q=80&w=1000&auto=format&fit=crop&hangman=${wrongGuesses}` }} 
                  style={styles.hangmanImage} 
                />
                <Text style={styles.guessesText}>
                  Ошибок: {wrongGuesses}/6
                </Text>
              </View>
              
              <View style={styles.wordSection}>
                <Text style={styles.wordPrompt}>
                  {enemy.wordPrompt || "Угадай слово, чтобы атаковать:"}
                </Text>
                {renderWord()}
              </View>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleUseHint}
                disabled={battleResult !== null}
              >
                <Lightbulb size={20} color="#E6E1F9" />
                <Text style={styles.actionText}>Подсказка</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, abilityUsed && styles.actionButtonDisabled]}
                onPress={() => setShowAbilityMenu(true)}
                disabled={abilityUsed || battleResult !== null}
              >
                <Zap size={20} color="#E6E1F9" />
                <Text style={styles.actionText}>Способность</Text>
              </TouchableOpacity>
            </View>
            
            {showAbilityMenu && playerClass && (
              <View style={styles.abilityMenu}>
                {playerClass.abilities.map((ability) => (
                  <TouchableOpacity
                    key={ability.id}
                    style={styles.abilityButton}
                    onPress={() => handleUseAbility(ability)}
                  >
                    <Text style={styles.abilityButtonName}>{ability.name}</Text>
                    <Text style={styles.abilityButtonDesc}>{ability.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {renderKeyboard()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Import missing components
const Coins = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, borderRadius: size/2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#1E1A2E', fontSize: size/2, fontWeight: 'bold' }}>$</Text>
  </View>
);

const Award = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Zap size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1A2E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1A2E",
  },
  loadingText: {
    fontSize: 18,
    color: "#E6E1F9",
  },
  battleContent: {
    padding: 16,
  },
  battleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#9D71EA",
  },
  playerStats: {
    marginLeft: 10,
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  healthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  healthText: {
    fontSize: 14,
    color: "#E6E1F9",
    marginLeft: 4,
  },
  healthBarContainer: {
    height: 6,
    backgroundColor: "#3A2D5F",
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  healthBar: {
    height: "100%",
    borderRadius: 3,
  },
  vsContainer: {
    marginHorizontal: 10,
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9D71EA",
  },
  enemyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  enemyStats: {
    marginRight: 10,
    flex: 1,
    alignItems: "flex-end",
  },
  enemyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
    textAlign: "right",
  },
  enemyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FF6B8A",
  },
  battleScene: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  battleBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  battleOverlay: {
    flex: 1,
    backgroundColor: "rgba(30, 26, 46, 0.7)",
    padding: 16,
    flexDirection: "row",
  },
  hangmanContainer: {
    width: 100,
    alignItems: "center",
  },
  hangmanImage: {
    width: 80,
    height: 120,
    marginBottom: 8,
  },
  guessesText: {
    fontSize: 14,
    color: "#E6E1F9",
  },
  wordSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wordPrompt: {
    fontSize: 16,
    color: "#E6E1F9",
    marginBottom: 16,
    textAlign: "center",
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterContainer: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#9D71EA",
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  letterPlaceholder: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E6E1F9",
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A2D5F",
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 6,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 16,
    color: "#E6E1F9",
    marginLeft: 8,
  },
  abilityMenu: {
    backgroundColor: "#2A2440",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  abilityButton: {
    backgroundColor: "#3A2D5F",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  abilityButtonName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
    marginBottom: 4,
  },
  abilityButtonDesc: {
    fontSize: 14,
    color: "#B8B2CC",
  },
  keyboardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  keyboardButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3A2D5F",
    borderRadius: 8,
    margin: 4,
  },
  keyboardButtonDisabled: {
    opacity: 0.5,
  },
  keyboardButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E6E1F9",
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E6E1F9",
    marginBottom: 24,
  },
  rewardsContainer: {
    backgroundColor: "#2A2440",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  enemyImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 18,
    color: "#E6E1F9",
    marginBottom: 16,
    textAlign: "center",
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rewardText: {
    fontSize: 16,
    color: "#E6E1F9",
    marginLeft: 8,
  },
  levelUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A2D5F",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  levelUpText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9D71EA",
    marginLeft: 8,
  },
  defeatContainer: {
    backgroundColor: "#2A2440",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  defeatText: {
    fontSize: 16,
    color: "#FF6B8A",
    marginBottom: 12,
  },
  defeatHint: {
    fontSize: 14,
    color: "#B8B2CC",
    textAlign: "center",
  },
  continueButton: {
    width: "100%",
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