import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import Pusher, { Channel } from "pusher-js";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher(environment.pusherKey, {
      cluster: environment.pusherCluster,
    });
  }

  listen<T>(channelName: string, event: string): Observable<T> {
    return new Observable<T>(observer => {
      const channel: Channel = this.pusher.subscribe(channelName);
      channel.bind(event, (data: T) => observer.next(data));

      return () => {
        channel.unbind(event);
        this.pusher.unsubscribe(channelName);
      }
    })
  }
}
