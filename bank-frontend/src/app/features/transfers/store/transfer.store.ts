import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { TransferApiService, GetAllTransfersParams } from '../services/transfer-api.service';
import {
  PaginatedResponse,
  Transfer,
  TransferResponse,
  TransferStatisticsResponse,
  TransferLimitsResponse,
  VerifyAccountResponse,
  RecurringTransferResponse,
  TransferReceiptResponse,
  MessageResponse,
  InternalTransferRequest,
  ExternalTransferRequest,
  ScheduledTransferRequest,
  RecurringTransferRequest,
  VerifyAccountRequest
} from '@core/models';

interface TransferState {
  transfers: Transfer[];
  pagination: PaginatedResponse<Transfer> | null;
  isLoading: boolean;
  error: string | null;
  filter: Omit<GetAllTransfersParams, 'pageable'>;
  pageable: { page: number; size: number; sort?: string[] };
  selectedTransfer: Transfer | null;
  statistics: TransferStatisticsResponse | null;
  limits: TransferLimitsResponse | null;
  verificationResult: VerifyAccountResponse | null;
  receipt: TransferReceiptResponse | null;
}

const initialState: TransferState = {
  transfers: [],
  pagination: null,
  isLoading: false,
  error: null,
  filter: {},
  pageable: { page: 0, size: 10 },
  selectedTransfer: null,
  statistics: null,
  limits: null,
  verificationResult: null,
  receipt: null,
};

export const TransferStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ transfers, pagination, selectedTransfer, statistics, limits, verificationResult }) => ({
    totalRecords: computed(() => pagination()?.totalElements ?? 0),
    totalPages: computed(() => pagination()?.totalPages ?? 0),
    selectedTransferDetails: computed(() => selectedTransfer),
    transferStats: computed(() => statistics),
    transferLimits: computed(() => limits),
    accountVerification: computed(() => verificationResult),
  })),
  withMethods(
    (
      store,
      transferApiService = inject(TransferApiService),
    ) => ({
      // Core transfer loading
      loadTransfers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() => {
            const params: GetAllTransfersParams = {
              ...store.filter(),
              pageable: store.pageable(),
            };
            return transferApiService.getAllTransfers(params).pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, {
                    transfers: response.content,
                    pagination: response,
                    isLoading: false,
                  });
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to load transfers',
                    isLoading: false,
                  });
                },
              })
            );
          })
        )
      ),

      // Transfer creation
      internalTransfer: rxMethod<InternalTransferRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((data) =>
            transferApiService.internalTransfer(data).pipe(
              tapResponse({
                next: (response) => {
                  // Add new transfer to the list
                  patchState(store, (state) => ({
                    transfers: [response, ...state.transfers],
                    isLoading: false,
                  }));
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to create internal transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      externalTransfer: rxMethod<ExternalTransferRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((data) =>
            transferApiService.externalTransfer(data).pipe(
              tapResponse({
                next: (response) => {
                  // Add new transfer to the list
                  patchState(store, (state) => ({
                    transfers: [response, ...state.transfers],
                    isLoading: false,
                  }));
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to create external transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      scheduledTransfer: rxMethod<ScheduledTransferRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((data) =>
            transferApiService.scheduledTransfer(data).pipe(
              tapResponse({
                next: (response) => {
                  // Add new transfer to the list
                  patchState(store, (state) => ({
                    transfers: [response, ...state.transfers],
                    isLoading: false,
                  }));
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to create scheduled transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      recurringTransfer: rxMethod<RecurringTransferRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((data) =>
            transferApiService.recurringTransfer(data).pipe(
              tapResponse({
                next: (response) => {
                  // Add new recurring transfer to the list
                  // Convert RecurringTransferResponse to Transfer format
                  const transfer: Transfer = {
                    id: response.id,
                    fromAccountId: response.fromAccountId,
                    toAccountId: response.toAccountId,
                    transferType: response.transferType,
                    amount: response.amount,
                    currency: response.currency,
                    reference: '', // Recurring transfers don't have reference
                    recipientName: '', // Recurring transfers don't have recipient name
                    description: response.description,
                    status: response.isActive ? 'ACTIVE' : 'CANCELLED',
                    scheduledDate: response.startDate,
                    createdAt: response.createdAt
                  };

                  patchState(store, (state) => ({
                    transfers: [transfer, ...state.transfers],
                    isLoading: false,
                  }));
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to create recurring transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      // Transfer details and operations
      getTransfer: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            transferApiService.getTransfer(id).pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, { selectedTransfer: response, isLoading: false });
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to load transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      getReceipt: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            transferApiService.getReceipt(id).pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, { receipt: response, isLoading: false });
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to load receipt',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      cancelTransfer: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            transferApiService.cancelTransfer(id).pipe(
              tapResponse({
                next: (response) => {
                  // Update the transfer status in the list
                  patchState(store, (state) => ({
                    transfers: state.transfers.map(t =>
                      t.id === id ? { ...t, status: 'CANCELLED' } : t
                    ),
                    isLoading: false,
                  }));
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to cancel transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      cancelRecurringTransfer: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            transferApiService.cancelRecurringTransfer(id).pipe(
              tapResponse({
                next: (response) => {
                  // Update the recurring transfer status in the list
                  patchState(store, (state) => ({
                    transfers: state.transfers.map(t =>
                      t.id === id ? { ...t, status: 'CANCELLED' } : t
                    ),
                    isLoading: false,
                  }));
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to cancel recurring transfer',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      // Statistics and limits
      loadStatistics: rxMethod<{ startDate?: string; endDate?: string }>(
        pipe(
          switchMap(({ startDate, endDate }) =>
            transferApiService.getStatistics(startDate, endDate).pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, { statistics: response });
                },
                error: (error: Error) => {
                  console.error('Failed to load statistics:', error);
                },
              })
            )
          )
        )
      ),

      loadLimits: rxMethod<void>(
        pipe(
          switchMap(() =>
            transferApiService.getTransferLimits().pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, { limits: response });
                },
                error: (error: Error) => {
                  console.error('Failed to load limits:', error);
                },
              })
            )
          )
        )
      ),

      // Account verification
      verifyAccount: rxMethod<VerifyAccountRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((data) =>
            transferApiService.verifyAccount(data).pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, { verificationResult: response, isLoading: false });
                },
                error: (error: Error) => {
                  patchState(store, {
                    error: error.message || 'Failed to verify account',
                    isLoading: false,
                  });
                },
              })
            )
          )
        )
      ),

      // Utility methods
      setFilter(filter: Partial<Omit<GetAllTransfersParams, 'pageable'>>) {
        patchState(store, { filter: { ...store.filter(), ...filter }, pageable: { ...store.pageable(), page: 0 } });
        this.loadTransfers();
      },
      setPage(page: number) {
        patchState(store, { pageable: { ...store.pageable(), page } });
        this.loadTransfers();
      },
      setPageSize(size: number) {
        patchState(store, { pageable: { ...store.pageable(), size, page: 0 } });
        this.loadTransfers();
      },
      setSort(sort: string[]) {
        patchState(store, { pageable: { ...store.pageable(), sort } });
        this.loadTransfers();
      },

      // Reset methods
      clearError(): void {
        patchState(store, { error: null });
      },
      clearSelectedTransfer(): void {
        patchState(store, { selectedTransfer: null });
      },
      clearReceipt(): void {
        patchState(store, { receipt: null });
      },
      clearVerificationResult(): void {
        patchState(store, { verificationResult: null });
      }
    })
  )
);
