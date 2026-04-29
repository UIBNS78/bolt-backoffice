import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OwnerList } from './types/owner-list';
import { environment } from 'environments/environment';
import { OwnerOptionsResponse } from './types/owner-options-response';
import { Owner } from '@shared/types/owner';
import { InputSelectOptions } from '@shared/components/types/input-select-options';

@Injectable({
  providedIn: 'root',
})
export class OwnersService {
  // services
  private readonly http: HttpClient = inject(HttpClient);
  // vars
  private _owners: WritableSignal<OwnerOptionsResponse[]> = signal<OwnerOptionsResponse[]>([]);

  public options: Signal<InputSelectOptions[]> = computed(() => 
    this._owners().map(o => ({
      id: o.id,
      label: o.commercialName
    }))
  );

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
      map(data => {
        this._owners.set(data.owners);
        return data.owners;
      })
    );
  }

  create(data: Owner): Observable<void> {
    return this.http.post<{ ownerId: number; userId: number }>(`${environment.apiURL}/owners`, data).pipe(
      map(({ ownerId, userId }) => {
        this._owners.update(owners => [...owners, {
          id: ownerId,
          userId: userId,
          name: data.name,
          firstName: data.firstName,
          gender: data.gender,
          commercialName: data.commercialName
        }]);
      })
    );
  }

  updateState(userId: number, state: boolean): Observable<void> {
    return this.http.patch<void>(`${environment.apiURL}/owners/${userId}/state`, { state });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/owners/${id}`).pipe(
      map(() => {
        this._owners.update(owners => owners.filter(o => o.id !== id));
      })
    );
  }
}
