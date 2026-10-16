import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateRange } from '@shared/types/common';
import { Notification } from '@shared/types/notification';
import { NotificationPusherData } from '@shared/types/pusher';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http: HttpClient = inject(HttpClient);

  init(): Observable<NotificationPusherData[]> {
    return this.http.get<{ notifications: NotificationPusherData[] }>(`${environment.apiURL}/notifications/init`).pipe(
      map(data => data.notifications)
    );
  }
  
  getAll(dates: DateRange): Observable<Notification[]> {
    const params = new HttpParams({
      fromObject: dates
    });
    
    return this.http.get<{ notifications: Notification[] }>(`${environment.apiURL}/notifications`, { params }).pipe(
      map(data => data.notifications)
    );
  }

  markAsPushed(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/notifications/pushed`, { ids });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.get<void>(`${environment.apiURL}/notifications/read/${id}`);
  }

  markAllAsRead(): Observable<void> {
    return this.http.get<void>(`${environment.apiURL}/notifications/read-all`);
  }
}
