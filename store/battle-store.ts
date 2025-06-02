import { create } from "zustand";

interface BattleState {
  currentWord: string | null;
  guessedLetters: string[];
  wrongGuesses: number;
  isWordGuessed: boolean;
  initBattle: (words: string[]) => void;
  guessLetter: (letter: string) => { correct: boolean };
  useHint: () => { success: boolean; letter?: string };
  resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  currentWord: null,
  guessedLetters: [],
  wrongGuesses: 0,
  isWordGuessed: false,
  
  initBattle: (words) => {
    // Select a random word from the list
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex].toUpperCase();
    
    set({
      currentWord: word,
      guessedLetters: [],
      wrongGuesses: 0,
      isWordGuessed: false,
    });
  },
  
  guessLetter: (letter) => {
    const { currentWord, guessedLetters, wrongGuesses } = get();
    
    if (!currentWord || guessedLetters.includes(letter)) {
      return { correct: false };
    }
    
    const updatedGuessedLetters = [...guessedLetters, letter];
    
    // Check if the letter is in the word
    const isCorrect = currentWord.includes(letter);
    
    // Update wrong guesses count if the letter is not in the word
    const updatedWrongGuesses = isCorrect ? wrongGuesses : wrongGuesses + 1;
    
    // Check if the word is completely guessed
    const isComplete = currentWord.split("").every(char => 
      updatedGuessedLetters.includes(char)
    );
    
    set({
      guessedLetters: updatedGuessedLetters,
      wrongGuesses: updatedWrongGuesses,
      isWordGuessed: isComplete,
    });
    
    return { correct: isCorrect };
  },
  
  useHint: () => {
    const { currentWord, guessedLetters } = get();
    
    if (!currentWord) {
      return { success: false };
    }
    
    // Find a letter that hasn't been guessed yet
    const unguessedLetters = currentWord.split("").filter(char => 
      !guessedLetters.includes(char)
    );
    
    if (unguessedLetters.length === 0) {
      return { success: false };
    }
    
    // Select a random unguessed letter
    const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
    const letter = unguessedLetters[randomIndex];
    
    // Add the letter to guessed letters
    const updatedGuessedLetters = [...guessedLetters, letter];
    
    // Check if the word is completely guessed
    const isComplete = currentWord.split("").every(char => 
      updatedGuessedLetters.includes(char)
    );
    
    set({
      guessedLetters: updatedGuessedLetters,
      isWordGuessed: isComplete,
    });
    
    return { success: true, letter };
  },
  
  resetBattle: () => {
    set({
      currentWord: null,
      guessedLetters: [],
      wrongGuesses: 0,
      isWordGuessed: false,
    });
  },
}));