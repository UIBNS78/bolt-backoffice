import { Injectable } from '@angular/core';
import { DmService } from './dm-service';
import { FilterDateType } from '@shared/types/common';
import { Observable } from 'rxjs';
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
    return this.http.get<RewardRate[]>(`${this.apiUrl}/reward-rates`);
  }
}
