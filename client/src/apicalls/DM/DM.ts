import axios from 'axios';
import { AxiosResponse } from 'axios';
import phaserGame from '../../PhaserGame';
import Game from '../../scenes/Game'

export const checkIfFirst = async (body: {senderName: string; receiverName: string}) => {
  try{
    const response = axios.post(`/lastdm/checkIfFirst`, body)
    console.log(body)
    return response;
  } catch(err) {
    console.error(err)
  }
}

// 현재 채팅방 목록을 가져옴
export const fetchRoomList = async (username: string): Promise<any> => {
  try {
    const response = await axios.post(`/lastdm/roomList`, {senderName : username} );
    return response.data.payload;
  } catch (error) {
    console.error(error);
  }
};
export const insertLastDM = async (body: {senderName: string; receiverName: string; message: string}) => {
  try {
    const response = await axios.post(`/lastdm/injectLastDM`, body);
    return response.data;
  } catch(err) {
    console.error(err)
  }
}

interface Response<T> {
  data: T;
  count?: number;
  msg?: string;
}
export type ApiResponse<T> = AxiosResponse<Response<T>>;
export interface RoomListResponse {
  _id: string;
  senderName: string;
  receiverName: string;
  message: string;
  roomId: string;
  updatedAt: Date | null;
}
export interface FetchChattingRequest {
  roomId: number;
  cursor: number | null;
}
