export type AccountType = 'SAVINGS' | 'CHECKING' | 'FIXED_DEPOSIT' | 'LOAN';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'CLOSED';

export interface Account {
    id: number;
    accountNumber: string;
    accountType: AccountType;
    balance: number;
    availableBalance: number;
    currency: string;
    status: AccountStatus;
    isPrimary: boolean;
    overdraftLimit: number;
    interestRate?: number;
    createdAt: string;
    updatedAt?: string;
}

export interface AccountSummary {
    totalBalance: number;
    totalAccounts: number;
    accounts: Account[];
}
