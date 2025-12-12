import { Backdrop, Box, CircularProgress } from '@mui/material';
import { FC } from 'react';
import { IPageLoader } from './PageLoader.declarations';

export const PageLoader: FC<IPageLoader> = ({ isLoading }) => (
    <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={isLoading}>
        <CircularProgress data-testid="loader"  color="inherit" />
    </Backdrop>
);
