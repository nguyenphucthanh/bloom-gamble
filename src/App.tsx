import logo from "./logo.svg"
import "./App.scss"
import { EnterPlayer } from "./features/gamble/EnterPlayer"
import { useAppSelector } from "./app/hooks"
import { selectPlayer } from "./features/gamble/gambleSlice"
import { useMemo } from "react"
import Table from "./features/gamble/Table"

function App() {
  const player = useAppSelector(selectPlayer)

  const isGameStarted = useMemo(() => {
    return !!player.A && !!player.B && !!player.C && !!player.D
  }, [player])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="text-center text-red-500 font-bold">
        Cờ bạc là bác thằng bần
      </div>
      <div className="text-center text-red-500 font-bold">
        Người thua bạc theo quy định pháp luật không cần phải trả nợ.
      </div>
      {isGameStarted ? <Table /> : <EnterPlayer />}
    </div>
  )
}

export default App
