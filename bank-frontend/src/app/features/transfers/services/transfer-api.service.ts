import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PaginatedResponse,
  Transfer,
  Pageable,
  TransferResponse,
  TransferReceiptResponse,
  TransferStatisticsResponse,
  TransferLimitsResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
  InternalTransferRequest,
  ExternalTransferRequest,
  ScheduledTransferRequest,
  RecurringTransferRequest,
  RecurringTransferResponse,
  MessageResponse
} from '@core/models';

export interface GetAllTransfersParams {
  accountId?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  pageable: Pageable;
}

@Injectable({
  providedIn: 'root'
})
export class TransferApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/transfers';

  // GET endpoints
  getAllTransfers(params: GetAllTransfersParams): Observable<PaginatedResponse<Transfer>> {
    let httpParams = new HttpParams()
      .set('page', params.pageable!.page.toString())
      .set('size', params.pageable!.size.toString());

    if (params.pageable.sort) {
      params.pageable.sort.forEach(sortParam => {
        httpParams = httpParams.append('sort', sortParam);
      });
    }

    if (params.accountId) {
      httpParams = httpParams.set('accountId', params.accountId.toString());
    }
    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => ({
        content: response.content,
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last
      }))
    );
  }

  getTransfer(id: number): Observable<TransferResponse> {
    return this.http.get<TransferResponse>(`${this.apiUrl}/${id}`);
  }

  getReceipt(id: number): Observable<TransferReceiptResponse> {
    return this.http.get<TransferReceiptResponse>(`${this.apiUrl}/${id}/receipt`);
  }

  getStatistics(startDate?: string, endDate?: string): Observable<TransferStatisticsResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransferStatisticsResponse>(`${this.apiUrl}/statistics`, { params });
  }

  getPendingTransfers(pageable?: Pageable): Observable<PaginatedResponse<Transfer>> {
    let params = new HttpParams();
    if (pageable) {
      params = params.set('page', pageable.page.toString());
      params = params.set('size', pageable.size.toString());
      if (pageable.sort) {
        pageable.sort.forEach(sortParam => {
          params = params.append('sort', sortParam);
        });
      }
    }

    return this.http.get<any>(`${this.apiUrl}/pending`, { params }).pipe(
      map(response => ({
        content: response.content,
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last
      }))
    );
  }

  getTransferLimits(): Observable<TransferLimitsResponse> {
    return this.http.get<TransferLimitsResponse>(`${this.apiUrl}/limits`);
  }

  // POST endpoints
  internalTransfer(data: InternalTransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/internal`, data);
  }

  externalTransfer(data: ExternalTransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/external`, data);
  }

  scheduledTransfer(data: ScheduledTransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/scheduled`, data);
  }

  recurringTransfer(data: RecurringTransferRequest): Observable<RecurringTransferResponse> {
    return this.http.post<RecurringTransferResponse>(`${this.apiUrl}/recurring`, data);
  }

  verifyAccount(data: VerifyAccountRequest): Observable<VerifyAccountResponse> {
    return this.http.post<VerifyAccountResponse>(`${this.apiUrl}/verify-account`, data);
  }

  // POST endpoints for management
  cancelTransfer(id: number): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }

  cancelRecurringTransfer(id: number): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/recurring/${id}/cancel`, {});
  }

  // Health check
  checkHealth(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}
