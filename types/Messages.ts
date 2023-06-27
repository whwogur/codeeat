export enum Message {
  // ***** MAIN ROOM *****
  // Client
  UPDATE_PLAYER,
  UPDATE_PLAYER_NAME,
  READY_TO_CONNECT,
  VIDEO_CONNECTED,
  DISCONNECT_STREAM,
  STOP_SCREEN_SHARE,
  ADD_CHAT_MESSAGE,
  SEND_DM,
  CHECK_DM,
  
  // Server
  SEND_ROOM_DATA,

  // ***** GAME ROOM *****
  // Client
  UPDATE_GAME_PLAY,
  // Server
  SEND_GAME_PLAYERS,

  // ***** Brick Game *****
  // Client
  // BRICK_GAME_READY,  // 플레이어 준비 상태 한번 더 확인?
  BRICK_GAME_COMMAND,
  // Server
  BRICK_GAME_ERROR,
  BRICK_GAME_STATE,
  BRICK_PLAYER_UPDATE,
  
  // ***** MOLE GAME *****
  SEND_MOLE,
  RECEIVE_MOLE,
  SEND_MY_POINT,
  RECEIVE_YOUR_POINT,

  // ***** NOT USED *****
  // CONNECT_TO_MOLEGAME,
  // DISCONNECT_FROM_MOLEGAME,
  // CONNECT_TO_BRICKGAME,
  // DISCONNECT_FROM_BRICKGAME,
  // CONNECT_TO_TYPINGGAME,
  // DISCONNECT_FROM_TYPINGGAME,  
  // DISABLE_GAME_PLAYER,
  // REACTIVATE_GAME_PLAYER,
}
