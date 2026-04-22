import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateRange } from '@shared/types/common';
import { Notification } from '@shared/types/notification';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(dates: DateRange): Observable<Notification[]> {
    const params = new HttpParams({
      fromObject: dates
    });
    
    return this.http.get<{ notifications: Notification[] }>(`${environment.apiURL}/notifications`, { params }).pipe(
      map(data => data.notifications)
    );
  }
}
