import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import store from '../stores'
import { Message } from '../../../types/Messages'
import { setNewMessage } from '../stores/DMStore';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
interface OldMessage{
  _id: string
  createdAt: number
  message: string
  senderName: string
  receiverName: string
}
export default class DMNetwork {
  private socketClient: Socket;
  public oldMessages: OldMessage[];
  constructor() {
    const socketUrl = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : `http://${window.location.hostname}:8888`
    
    this.socketClient = io(socketUrl, {
      transports: ['websocket', 'polling', 'flashsocket'],
      withCredentials: true,
    });
    this.oldMessages = []
    this.socketClient.on("connect_error", (err) => {
      console.log(`connetion err${err.message}`);
      console.error(err)
    })
    this.socketClient.on('message', (data) => {
      console.log(data,'라고 받음')
      store.dispatch(setNewMessage(data))
    })
  }

  async getSocket () {
    return this.socketClient;
  };

  joinRoom = (roomId: string, senderName: string, receiverName: string, callback:any) => {
    this.socketClient.emit('join-room', { roomId: roomId, username: senderName, receiverName: receiverName });
    console.log(' 여기 ---')
    this.socketClient.on('old-messages', (data) => {
      this.oldMessages = [];
      data.forEach((element: any) => {
        if (element.senderName) {
          this.oldMessages.push(element);
        }
      });
    });
    callback(this.oldMessages)
  };

  sendMessage = (message: object) => {
    console.log('메시지 전송 호출')
    this.socketClient.emit('message', message)
  }

  whoAmI = (username: string) => {
    this.socketClient.emit('whoAmI', username);
  };

}