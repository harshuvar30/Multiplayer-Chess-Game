import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

export const Chessboard = ({board,socket, chess, setBoard }:{
    board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][]
socket:WebSocket; chess: any; setBoard:any}) =>{
    const [from,setFrom] = useState<Square | null>(null);
    console.log("checking from value",from)
    const [to, setTo] = useState<Square | null>(null);
    console.log("checking to value",to)
    return (
        <div className="">
             {board.map((row,i)=>{
                 return <div key={i} className="flex">
                    {row.map((square,j)=>{
                    const squareRepresentation = String.fromCharCode(97+j) + (7-i+1)as Square

                        return <div onClick={()=> 
                            {if(!from){
                            console.log("checking which button is clicked",board[i][j],i,j)
                            setFrom(squareRepresentation) 
                            console.log("checking from value",from)
                        }
                            else {
                                socket.send(JSON.stringify({
                                    type:'move',
                                    move: { 
                                        from: from,
                                        to: squareRepresentation}
                                    }))
                                    setFrom(null)
                                    chess.move({ 
                                        from: from,
                                        to: squareRepresentation}
                                    )
                                    setBoard(chess.board())
                                
                            }
                        }}
                             key={j} className={`flex justify-center items-center  w-16 h-16 ${square?.color === 'b' ? 'text-slate-900' : 'text-white'} ${(i+j)%2 ===0 ? 'bg-green-500' : 'bg-white   '}`}>
                            {square? <img className="" src={`/${square?.color === 'b' ? square.type : `${square.type.toUpperCase()} copy`}.png`} />: null}  
                        </div>    
                    })
                }
                </div>
             })

            }
        </div>
    )
}