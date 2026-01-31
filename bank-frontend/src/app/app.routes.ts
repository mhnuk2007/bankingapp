import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    // Public routes - no authentication required (must come first)
    {
        path: '',
        loadChildren: () =>
            import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    // Authenticated routes - protected by guard, shared layout
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('@layout/components/main-layout/main-layout.component').then(
                (m) => m.MainLayoutComponent
            ),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('@features/dashboard/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
                title: 'Dashboard - SecureBank',
            },
            {
                path: 'accounts',
                loadChildren: () =>
                    import('./features/accounts/accounts.routes').then((m) => m.ACCOUNT_ROUTES),
            },
            {
                path: 'transactions',
                loadComponent: () =>
                    import('@features/dashboard/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
                title: 'Transactions - SecureBank',
            },
            {
                path: 'transfers',
                loadComponent: () =>
                    import('@features/dashboard/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
                title: 'Transfers - SecureBank',
            },
            {
                path: 'payments',
                loadComponent: () =>
                    import('@features/dashboard/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
                title: 'Payments - SecureBank',
            },
            {
                path: 'cards',
                loadComponent: () =>
                    import('@features/dashboard/components/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
                title: 'Cards - SecureBank',
            },
            {
                path: 'user',
                loadChildren: () =>
                    import('./features/user/user.routes').then((m) => m.USER_ROUTES),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
