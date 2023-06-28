import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData } from '../../types/Rooms'
import { GameState, GamePlayer } from './schema/GameState'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import GamePlayUpdateCommand from './commands/GamePlayUpdateCommand'
import { RainGameStartCommand } from './commands/RainGameStartCommand'
import { MakeWordCommand } from './commands/RainGameMakeWordCommand'
import {
  MoleGameGetUserInfo,
  MoleGameAddPoint,
} from './commands/MoleGameUpdateArrayCommand'

export class GameRoom extends Room<GameState> {
  private dispatcher = new Dispatcher(this)
  private name: string
  private description: string
  private password: string | null = null

  async onCreate(options: IGameRoomData) {
    const { name, description, password, username } = options
    this.name = name
    this.description = description
    this.autoDispose = true
    this.maxClients = 2

    let hasPassword = false
    if (password) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(password, salt)
      hasPassword = true
    }
    this.setMetadata({ name, description, hasPassword })

    this.setState(new GameState())
    this.state.host = username
    
    // when receiving updatePlayer message, call the PlayerUpdateCommand
    this.onMessage(Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
        this.broadcastPlayersData(this)
      }
    )

    // when receiving updatePlayerName message, call the PlayerUpdateNameCommand
    this.onMessage(Message.UPDATE_PLAYER_NAME, (client, message: { name: string }) => {
      this.dispatcher.dispatch(new PlayerUpdateNameCommand(), {
        client,
        name: message.name,
      })
      this.broadcastPlayersData(this)
    })


    this.onMessage(Message.RAIN_GAME_START, (client) => {
      this.dispatcher.dispatch(new RainGameStartCommand(), { client });
      this.dispatcher.dispatch(new MakeWordCommand(), { room: this });
      this.broadcast(Message.RAIN_GAME_START, Array.from(this.state.rainGameStates).reduce((obj, [key, value]) => (obj[key]= value, obj), {}));
    });

    this.onMessage(Message.SEND_RAIN_GAME_PLAYERS, (content) => {
      console.log("만들라는 명령 서버가 받았습니다.")
      this.startGeneratingKeywords();
      
    })

    // ↓ Mole Game
    this.onMessage(Message.SEND_MOLE, (client, message: { name: string, character: string }) => {
      this.dispatcher.dispatch(new MoleGameGetUserInfo(), {
        client,
        name: message.name,
        character: message.character,
        point: ''
      })
      this.broadcast(Message.RECEIVE_MOLE, { name: message.name, character: message.character }, { except: client });
    })

    this.onMessage(Message.SEND_MY_POINT, (client, message: { point: string }) => {
      this.dispatcher.dispatch(new MoleGameAddPoint(), {
        client,
        name: '',
        character: '',
        point: message.point,
      })
      this.broadcast(Message.RECEIVE_YOUR_POINT, { point: message.point }, { except: client });
    })
  }

  async onAuth(client: Client, options: { password: string | null }) {
    if (this.password) {
      const validPassword = await bcrypt.compare(options.password, this.password)
      if (!validPassword) {
        throw new ServerError(403, 'Password is incorrect!')
      }
    }
    return true
  }

  onJoin(client: Client, options: any) {
    const { username } = options
    this.state.players.set(client.sessionId, new GamePlayer(username))
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    })

    this.broadcastPlayersData(this)
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    
    this.broadcastPlayersData(this)
  }

  private startGeneratingKeywords() {
    const generateKeywords = async () => {
      try {
        await this.dispatcher.dispatch(new MakeWordCommand(), { room: this });
  
        this.state.rainGameStates.forEach((RainGameState, owner) => {
          this.broadcast(Message.SEND_RAIN_GAME_PLAYERS, RainGameState);
          console.log("만든 단어 서버가 보냈습니다.")
        });
        
        // Schedule the next execution
        setTimeout(generateKeywords, 10000);
      } catch (error) {
        console.error('Failed to generate keywords:', error);
      }
    };

    // Start the first execution
    generateKeywords();
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }

  broadcastPlayersData(room: GameRoom) {
    const players = Array.from(room.state.players.values())
      .map((player: GamePlayer) => ({
        name: player.name,
        anim: player.anim,
      }))
    room.broadcast(Message.SEND_GAME_PLAYERS, players)
  }
}
