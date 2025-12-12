'use client';

import { Alert, Snackbar } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { IErrorSnackbar } from './ErrorSnackbar.declarations';

export const ErrorSnackbar: FC<IErrorSnackbar> = ({
    isError,
    message = 'Something went wrong',
    autoHideDuration = 3000,
}) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isError) {
            setOpen(true);
        }
    }, [isError]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
