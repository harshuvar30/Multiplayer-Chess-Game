import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game{
    public player1 : WebSocket;
    public player2 : WebSocket;
    private board : Chess;
    private moveCount: number;
    private moves : string[];
    private startTime :  Date;
    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.moveCount = 0;
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:'white'
            }
        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{color:'black'}
        }))
    }
    makeMove(socket : WebSocket, move: {
        from:string;
        to: string;
    }){
        console.log('checking move',move)
        console.log('checking move',this.board.moves())
        if(this.moveCount % 2===0 && socket !== this.player1)
        {
            console.log("inside first if block")
            return
        }

        if(this.moveCount % 2 === 1 && socket !== this.player2){
            console.log("inside second if block")
            return
        }
            
        try{
            this.board.move(move)
        }catch(err){
            console.log("got error",err)
            return
        }
        if(this.board.isGameOver()){
            console.log("checig game over")
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === 'w' ? 'white': 'black'
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === 'w' ? 'white': 'black'
                }
            }))
            return
        }

        if(this.moveCount % 2 === 0){
            console.log("inside if block 1 ")
            this.player2.send(JSON.stringify({
                type:MOVE,
                move
            }))
        }else{
            console.log("inside if block 2")
            this.player1.send(JSON.stringify({
                type:MOVE,
                move
            }))
        }

        this.moveCount++;
    }
}