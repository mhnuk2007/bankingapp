import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PaginatedResponse,
  Transaction,
  Pageable,
  TransactionResponse,
  TransactionReceiptResponse,
  TransactionStatisticsResponse,
  TransactionCategoriesResponse,
  MessageResponse,
  DepositRequest,
  WithdrawRequest,
  RaiseDisputeRequest,
  SearchTransactionRequest,
  ExportTransactionsRequest
} from '@core/models';

export interface GetAllTransactionsParams {
  accountId?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  pageable: Pageable;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/transactions';

  // GET endpoints
  getAllTransactions(params: GetAllTransactionsParams): Observable<PaginatedResponse<Transaction>> {
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
    if (params.minAmount) {
      httpParams = httpParams.set('minAmount', params.minAmount.toString());
    }
    if (params.maxAmount) {
      httpParams = httpParams.set('maxAmount', params.maxAmount.toString());
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

  getTransaction(id: number): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.apiUrl}/${id}`);
  }

  getReceipt(id: number): Observable<TransactionReceiptResponse> {
    return this.http.get<TransactionReceiptResponse>(`${this.apiUrl}/${id}/receipt`);
  }

  getStatistics(accountId?: number, startDate?: string, endDate?: string): Observable<TransactionStatisticsResponse> {
    let params = new HttpParams();
    if (accountId) params = params.set('accountId', accountId.toString());
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionStatisticsResponse>(`${this.apiUrl}/statistics`, { params });
  }

  getRecentTransactions(accountId?: number, limit?: number, pageable?: Pageable): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams();
    if (accountId) params = params.set('accountId', accountId.toString());
    if (limit) params = params.set('limit', limit.toString());
    if (pageable) {
      params = params.set('page', pageable.page.toString());
      params = params.set('size', pageable.size.toString());
      if (pageable.sort) {
        pageable.sort.forEach(sortParam => {
          params = params.append('sort', sortParam);
        });
      }
    }

    return this.http.get<any>(`${this.apiUrl}/recent`, { params }).pipe(
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

  getPendingTransactions(accountId?: number, pageable?: Pageable): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams();
    if (accountId) params = params.set('accountId', accountId.toString());
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

  getCategories(): Observable<TransactionCategoriesResponse> {
    return this.http.get<TransactionCategoriesResponse>(`${this.apiUrl}/categories`);
  }

  // POST endpoints
  deposit(data: DepositRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/deposit`, data);
  }

  withdraw(data: WithdrawRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/withdraw`, data);
  }

  searchTransactions(data: SearchTransactionRequest, pageable: Pageable): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      pageable.sort.forEach(sortParam => {
        params = params.append('sort', sortParam);
      });
    }

    return this.http.post<any>(`${this.apiUrl}/search`, data, { params }).pipe(
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

  exportTransactions(data: ExportTransactionsRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, data, { responseType: 'blob' });
  }

  raiseDispute(id: number, data: RaiseDisputeRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/${id}/dispute`, data);
  }

  cancelTransaction(id: number): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Health check
  checkHealth(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}
