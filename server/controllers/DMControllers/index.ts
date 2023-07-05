import dm from '../../models/DM';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import LastDM from '../../models/LastDM';
import { updateLastDM, updateRoomId, addLastDM, deleteLastDM } from '../LastDMControllers';
import { userMap } from '../..';
const rooms: Record<string, string[]> = {}
interface IRoomParams {
  roomId: string;
  username: string;
  receiverName: string;
}
const time_diff = 9 * 60 * 60 * 1000;
export const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    console.log('chatroom[', roomId, '] created')
    return roomId
}

export const DMController = (socket: Socket) => {
  const joinRoom = (host: { roomId: string; username: string; receiverName: string }) => {
    let { roomId } = host;
    const { username, receiverName } = host;
  
    if (rooms[roomId]) {
      console.log('대화방 유저 입장')
      rooms[roomId].push(username);
      socket.join(roomId);
    } else {
      roomId = createRoom();
      addLastDM({senderName: username, receiverName: receiverName, message: ' ', roomId})
      updateRoomId({ senderName: username, receiverName: receiverName, roomId: roomId })
      .then(() => {
        rooms[roomId].push(username);
      });
      // if (roomId == 'first'){
      //   roomId = createRoom();
      //   console.log('생성')
      //   updateRoomId({ roomId: roomId, senderName: username, receiverName: receiverName })
      //   .then(() => {
      //     rooms[roomId].push(username);
      //   })  
      // } else {
      //   roomId = createRoom();
      //   addLastDM({senderName: username, receiverName: receiverName, message: ' ', roomId})
      //   updateRoomId({ roomId: roomId, senderName: username, receiverName: receiverName })
      //   .then(() => {
      //     deleteLastDM({senderName: username, receiverName: receiverName, message: ' '})
      //     rooms[roomId].push(username);
      //   })
      // }
    }
    readMessage({ roomId, username, receiverName });
  };

  const sendMessage = (obj: {
    roomId: string;
    senderName: string;
    receiverName: string;
    message: string;
  }) => {
  const { roomId, senderName, receiverName, message } = obj;
    if (message) {
      addDM({ senderName: senderName, receiverName: receiverName, message: message });
      updateLastDM({ senderName: senderName, receiverName: receiverName, message: message })
      userMap.get(receiverName)?.emit('message', obj);
      console.log('@DMcontrollers/sendMessage -',senderName,'가',receiverName,'에게',obj.message, '라고 보냄')
    }
  };

  const readMessage = async (message: { roomId: string; username: string; receiverName: string; }) => {
    const { roomId, username, receiverName } = message;
    // console.log('읽어들임')
    getDMMessage(username,receiverName)
    .then((dmMessage) => {
      socket.emit('old-messages', dmMessage);
      
    })
    .catch((error) => {
      console.error('readMessage', error);
    });
  };
  socket.on('join-room', joinRoom);
  socket.on('message', sendMessage);
}


export const addDM = async (message: {
  senderName: string;
  receiverName: string;
  message: string;
}) => {
  try {
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let createdAt = utc + time_diff;
    
    await dm.collection.insertOne({
      senderName: message.senderName,
      receiverName: message.receiverName,
      message: message.message,
      createdAt: createdAt,
    });
    
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

  
export const getDMMessage = async (senderName: string, receiverName: string) => {
    let result = new Array();
    await dm.collection
      .find({
        $or: [
          { $and: [{ senderName: senderName }, { receiverName: receiverName }] },
          { $and: [{ senderName: receiverName }, { receiverName: senderName }] },
        ],
      })
      .limit(50)
      .sort({ _id: 1 })
      .toArray()
      .then((elem) => {
        elem.forEach((json) => {
          result.push(json);
        });
      });
    LastDM.collection.find();
    return result;
  };