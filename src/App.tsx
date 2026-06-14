import { useGameState } from './hooks/useGameState'
import { StartScreen } from './components/StartScreen'
import { GameScreen } from './components/GameScreen'
import { EndingScreen } from './components/EndingScreen'

function App() {
  const {
    state,
    currentEvent,
    progress,
    ending,
    recommendedCount,
    totalChoices,
    createCharacter,
    startStage,
    chooseOption,
    dismissOutcome,
    restart,
  } = useGameState()

  switch (state.phase) {
    case 'CREATE':
      return (
        <StartScreen
          playerName={state.playerName}
          stage={state.stage}
          onStart={(name) => {
            createCharacter(name)
            // We need to defer startStage until after the character is created
            // The component will handle this through the PLAYING phase
          }}
        />
      )

    case 'PLAYING':
    case 'OUTCOME':
      return (
        <GameScreen
          state={state}
          currentEvent={currentEvent}
          progress={progress}
          onChoose={chooseOption}
          onDismissOutcome={dismissOutcome}
          onStartStage={startStage}
        />
      )

    case 'ENDING':
      if (!ending) return null
      return (
        <EndingScreen
          ending={ending}
          stats={state.stats}
          history={state.history}
          stage={state.stage}
          recommendedCount={recommendedCount}
          totalChoices={totalChoices}
          onRestart={restart}
        />
      )

    default:
      return null
  }
}

export default App
