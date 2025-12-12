'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { MediaQueryProvider } from '@/context';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" style={{ minWidth: '320px', overflowX: 'auto' }} suppressHydrationWarning>
        <body style={{ minWidth: '320px', overflowX: 'auto' }}>
        <Provider store={store}>
            <MediaQueryProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {children}
                </LocalizationProvider>
            </MediaQueryProvider>
        </Provider>
        </body>
        </html>
    );
}
