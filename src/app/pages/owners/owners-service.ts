import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OwnerList } from './types/owner-list';
import { environment } from 'environments/environment';
import { OwnerOptionsResponse } from './types/owner-options-response';
import { Owner } from '@shared/types/owner';

@Injectable({
  providedIn: 'root',
})
export class OwnersService {
  private http: HttpClient = inject(HttpClient);

  getAll(pagination?: {
    itemsPerPage: number;
    page: number;
}): Observable<OwnerList> {
    const params = new HttpParams({
      fromObject: {
        page: pagination ? pagination.page : 1,
        itemsPerPage: pagination ? pagination.itemsPerPage : 10
      }
    });

    return this.http.get<OwnerList>(`${environment.apiURL}/owners/all`, { params });
  }

  getAllAsOptions(): Observable<OwnerOptionsResponse[]> {
    return this.http.get<{ owners: OwnerOptionsResponse[] }>(`${environment.apiURL}/owners/all-options`).pipe(
      map(data => data.owners)
    );
  }

  create(data: Owner): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/owners`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/owners/${id}`);
  }
}
