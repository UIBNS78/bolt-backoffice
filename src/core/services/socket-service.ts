import { Injectable } from '@angular/core';
import { SocketEvent } from '@shared/types/socket';
import { environment } from 'environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private _socket: Socket;

  constructor() {
    this._socket = io(environment.backendUri);
  }

  onEvent(event: SocketEvent, callback: (data: any) => void) {
    this._socket.on(event, callback);
  }

  emitEvent(event: SocketEvent, data: any) {
    this._socket.emit(event, data);
  }
}
