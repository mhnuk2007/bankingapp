import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@features/auth/store/auth.store';
import { CurrencyPipe, DatePipe } from '@angular/common';

interface QuickAction {
    id: string;
    title: string;
    icon: string;
    route: string;
    color: string;
}

interface Transaction {
    id: number;
    type: 'credit' | 'debit';
    description: string;
    amount: number;
    date: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, CurrencyPipe, DatePipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
    protected readonly authStore = inject(AuthStore);

    protected readonly isLoading = signal(false);
    protected readonly totalBalance = signal(24563.89);
    protected readonly monthlyIncome = signal(8450.0);
    protected readonly monthlyExpenses = signal(3240.5);

    protected readonly accounts = signal([
        { id: 1, name: 'Savings Account', number: '****4521', balance: 18234.56, type: 'savings' },
        { id: 2, name: 'Checking Account', number: '****7893', balance: 6329.33, type: 'checking' },
    ]);

    protected readonly recentTransactions = signal<Transaction[]>([
        { id: 1, type: 'credit', description: 'Salary Deposit', amount: 5200.0, date: '2026-01-28' },
        { id: 2, type: 'debit', description: 'Electric Bill', amount: -145.0, date: '2026-01-27' },
        { id: 3, type: 'debit', description: 'Grocery Store', amount: -89.5, date: '2026-01-26' },
        { id: 4, type: 'credit', description: 'Refund', amount: 45.0, date: '2026-01-25' },
        { id: 5, type: 'debit', description: 'Subscription', amount: -14.99, date: '2026-01-24' },
    ]);

    protected readonly quickActions: QuickAction[] = [
        { id: 'transfer', title: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', route: '/transfers', color: 'blue' },
        { id: 'pay', title: 'Pay Bills', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', route: '/payments', color: 'green' },
        { id: 'cards', title: 'Cards', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', route: '/cards', color: 'purple' },
        { id: 'history', title: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', route: '/transactions', color: 'orange' },
    ];

    protected readonly greeting = computed(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    });

    protected readonly savingsRate = computed(() => {
        const income = this.monthlyIncome();
        const expenses = this.monthlyExpenses();
        if (income === 0) return 0;
        return Math.round(((income - expenses) / income) * 100);
    });

    ngOnInit(): void {
        this.authStore.loadUserFromToken();
    }
}
