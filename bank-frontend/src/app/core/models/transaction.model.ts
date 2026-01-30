export type TransactionType =
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'TRANSFER_IN'
    | 'TRANSFER_OUT'
    | 'PAYMENT'
    | 'FEE'
    | 'INTEREST';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Transaction {
    id: number;
    referenceNumber: string;
    accountId: number;
    accountNumber: string;
    transactionType: TransactionType;
    amount: number;
    balanceAfter: number;
    currency: string;
    description: string;
    status: TransactionStatus;
    recipientAccountNumber?: string;
    recipientName?: string;
    senderAccountNumber?: string;
    senderName?: string;
    transactionDate: string;
    createdAt: string;
}

export interface TransactionFilter {
    accountId?: number;
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    size?: number;
}
