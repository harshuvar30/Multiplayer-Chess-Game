import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import url from 'url'
import { extractAuthUser } from './auth';

const wss = new WebSocketServer({ port: 8080 });

const gamemanager = new GameManager()
wss.on('connection', function connection(ws,req) {
  //@ts-ignore
  const token: string = url.parse(req.url,true).query.token
  const user = extractAuthUser(token,ws)
  gamemanager.addUser(user)
  ws.on('close', ()=>gamemanager.removeUser(ws))
});