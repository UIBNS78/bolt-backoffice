import { Injectable } from '@angular/core';
import { DmService } from './dm-service';
import { FilterDateType } from '@shared/types/common';
import { map, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { format } from 'date-fns';
import { DMRewardRatesList, RewardRate } from '../types/delivery-men-reward-rate';

@Injectable({
  providedIn: 'root',
})
export class DmRewardRatesService extends DmService {
  getDmRewardRates(params: FilterDateType): Observable<DMRewardRatesList> {
    const queryParams = new HttpParams({
      fromObject: {
        filter: params.filter,
        date: format(params.date, "yyyy-MM-dd"),
        page: params?.page ?? 1,
        itemsPerPage: params?.itemsPerPage ?? 10
      }
    });

    return this.http.get<DMRewardRatesList>(`${this.apiUrl}/reward-rates/dm-rewards-list`, { params: queryParams });
  }

  getRewardRates(): Observable<RewardRate[]> {
    return this.http.get<{ rewardRates: RewardRate[] }>(`${this.apiUrl}/reward-rates`).pipe(
      map(response => response.rewardRates)
    );
  }

  createRewardRate(rewardRate: RewardRate): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reward-rates`, rewardRate);
  }

  updateRewardRate(rewardRate: RewardRate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reward-rates/${rewardRate.id}`, rewardRate);
  }

  deleteRewardRate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reward-rates/${id}`);
  }

  applyRewardRate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reward-rates/${id}/apply`, {});
  }
}
