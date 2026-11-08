// Silahşör: Diyarın Kaderi — uygulama kökü (KT/MainActivity.kt karşılığı).
import React, { useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SoundManager } from './src/audio/SoundManager.js';
import { SaveManager } from './src/data/SaveManager.js';
import { getGameViewModel } from './src/ui/viewmodel/GameViewModel.js';
import { MainMenuScreen } from './src/ui/screens/MainMenuScreen.js';
import { MainScreen } from './src/ui/screens/MainScreen.js';
import { SettingsScreen } from './src/ui/screens/SettingsScreen.js';
import { StoryIntroScreen } from './src/ui/screens/StoryIntroScreen.js';
import { CharacterNamingScreen } from './src/ui/screens/CharacterNamingScreen.js';
import { Screen, Spinner, T, useFlow } from './src/ui/kit.js';
import { AmberGold, TextGold } from './src/ui/theme.js';

const AppScreen = {
  MAIN_MENU: 'MAIN_MENU',
  PROLOGUE_STORY: 'PROLOGUE_STORY',
  CHARACTER_NAMING: 'CHARACTER_NAMING',
  SETTINGS: 'SETTINGS',
  IN_GAME: 'IN_GAME',
};

function Oyun() {
  const gameViewModel = getGameViewModel();
  const [currentScreen, setCurrentScreen] = useState(AppScreen.MAIN_MENU);
  const player = useFlow(gameViewModel.player);

  switch (currentScreen) {
    case AppScreen.MAIN_MENU:
      return (
        <MainMenuScreen
          viewModel={gameViewModel}
          onStartNewGame={() => setCurrentScreen(AppScreen.PROLOGUE_STORY)}
          onContinueGame={() => setCurrentScreen(AppScreen.IN_GAME)}
          onOpenSettings={() => setCurrentScreen(AppScreen.SETTINGS)}
        />
      );
    case AppScreen.PROLOGUE_STORY:
      return <StoryIntroScreen onFinishStory={() => setCurrentScreen(AppScreen.CHARACTER_NAMING)} />;
    case AppScreen.CHARACTER_NAMING:
      return (
        <CharacterNamingScreen
          currentName={player ? player.name : ''}
          onConfirmName={(chosenName) => {
            gameViewModel.setPlayerName(chosenName);
            setCurrentScreen(AppScreen.IN_GAME);
          }}
        />
      );
    case AppScreen.SETTINGS:
      return <SettingsScreen onNavigateBack={() => setCurrentScreen(AppScreen.MAIN_MENU)} />;
    case AppScreen.IN_GAME:
    default:
      return <MainScreen gameViewModel={gameViewModel} onReturnToMainMenu={() => setCurrentScreen(AppScreen.MAIN_MENU)} />;
  }
}

export default function App() {
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    let iptal = false;
    // Ses ve kayıt yöneticilerini ilklendir (kayıt dosyası önceden belleğe alınır)
    Promise.all([SoundManager.initialize().catch(() => {}), SaveManager.initialize().catch(() => {})]).then(() => {
      if (!iptal) setHazir(true);
    });
    const abone = AppState.addEventListener('change', (durum) => {
      if (durum === 'active') SoundManager.resumeBgm();
      else if (durum === 'background' || durum === 'inactive') {
        SoundManager.pauseBgm();
        // Uygulama arka plana geçerken bekleyen kayıt hemen yazılır (ilerleme kaybolmasın)
        try {
          getGameViewModel().repository.kaydiHemenYaz();
        } catch (e) {}
      }
    });
    return () => {
      iptal = true;
      abone.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {hazir ? (
        <Oyun />
      ) : (
        <Screen>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Spinner color={AmberGold} size={48} />
            <T color={TextGold} size={18} serif>
              Diyarın Kaderi yükleniyor...
            </T>
          </View>
        </Screen>
      )}
    </SafeAreaProvider>
  );
}
