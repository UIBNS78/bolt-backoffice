import { Injectable } from '@angular/core';
import { DmService } from './dm-service';
import { Observable } from 'rxjs';
import { DMPaymentsList, UpdatePaymentStatusType } from '../types/delivery-men-payments';
import { FilterDateType } from '@shared/types/common';
import { HttpParams } from '@angular/common/http';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DmPaymentsService extends DmService {
  
  getDmPayments(queryParams: FilterDateType): Observable<DMPaymentsList> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        date: format(queryParams.date, "yyyy-MM-dd"),
        page: queryParams?.page ?? 1,
        itemsPerPage: queryParams?.itemsPerPage ?? 10
      }
    });
    
    return this.http.get<DMPaymentsList>(`${this.apiUrl}/payments`, { params });
  }

  updatePaymentStatus(id: number, data: UpdatePaymentStatusType): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/payments/${id}/status`, data);
  }
}
