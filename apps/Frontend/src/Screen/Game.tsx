import { useEffect, useState } from "react"
import { Button } from "../Components/Button"
import { Chessboard } from "../Components/Chessboard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"

export const INIT_GAME = 'init_game'
export const MOVE = 'move'
export const GAME_OVER = 'GAME OVER'
function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess())
  const [board, setBoard] = useState(chess.board())
  useEffect(()=>{
    if(!socket)
      return

    socket.onmessage = (event)=>{
      const message = JSON.parse(event.data)
      console.log('message is ...... >>>>>    ',message)

      switch (message.type){
        case INIT_GAME:
          setBoard(chess.board())
          console.log("Game initialized")
          break;
        case MOVE:
          const move = message.move
          try{
            chess.move(move)
          }
          catch(err){
            console.log('CHECKING ERROR',err)
          }
          setBoard(chess.board())
          console.log("Moved made")
          break;
        case GAME_OVER:
          console.log('Game over')
          break
      }
    }
  },[socket])

  if(!socket)
    return <div>Connecting....</div>
  return (
    <div className="flex justify-center">
    <div className="mt-8 max-w-screen-lg w-full">
    <div className="grid grid-cols-6 gap-4 w-full">
      <div className="col-span-4 w-full text-white text-center">
        <Chessboard board={board} socket={socket} chess={chess} setBoard={setBoard}/>
      </div>
      <div className="col-span-2 w-full text-white text-center bg-slate-800 flex items-center justify-center pl-3 pr-3">
        <Button onClick={()=>{
          socket?.send(JSON.stringify({
            type:INIT_GAME,
          }))
        }} >
                    ▶ PLAY
        </Button>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Game