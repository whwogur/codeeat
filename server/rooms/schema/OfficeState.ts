import { Schema, ArraySchema, SetSchema, MapSchema, type } from '@colyseus/schema'
import {
  IPlayer,
  IOfficeState,
  IMoleGame,
  IBrickGame,
  ITypingGame,
  IChatMessage,
} from '../../../types/IOfficeState'

export class Player extends Schema implements IPlayer {
  @type('string') name = ''
  @type('number') x = 705
  @type('number') y = 500
  @type('string') anim = 'adam_idle_down'
  @type('boolean') readyToConnect = false
  @type('boolean') videoConnected = false
}

export class BrickGame extends Schema implements IBrickGame {
  // @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class MoleGame extends Schema implements IMoleGame {
  // @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class TypingGame extends Schema implements ITypingGame {
  // @type('string') roomId = getRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class ChatMessage extends Schema implements IChatMessage {
  @type('string') author = ''
  @type('number') createdAt = new Date().getTime()
  @type('string') content = ''
}

export class OfficeState extends Schema implements IOfficeState {
  @type({ map: Player })
  players = new MapSchema<Player>()
  
  @type({ map: MoleGame })
  molegames = new MapSchema<MoleGame>()
  
  @type({ map: BrickGame })
  brickgames = new MapSchema<BrickGame>()

  @type({ map: TypingGame })
  typinggames = new MapSchema<TypingGame>()

  @type([ChatMessage])
  chatMessages = new ArraySchema<ChatMessage>()
}

// export const typinggameRoomIds = new Set<string>()
// export const moleGameRoomIds = new Set<string>()
// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
// const charactersLength = characters.length

// function getRoomId() {
//   let result = ''
//   for (let i = 0; i < 12; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   if (!typinggameRoomIds.has(result)) {
//     typinggameRoomIds.add(result)
//     return result
//   } else {
//     console.log('roomId exists, remaking another one.')
//     getRoomId()
//   }
// }
