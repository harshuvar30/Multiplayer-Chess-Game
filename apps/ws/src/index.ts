import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import url from 'url'

const wss = new WebSocketServer({ port: 8080 });

const gamemanager = new GameManager()
wss.on('connection', (ws)=> {
  //@ts-ignore
  const token: string = url.parse(req.url,true).query.token
  gamemanager.addUser(ws)
  ws.on('close', ()=>gamemanager.removeUser(ws))
});