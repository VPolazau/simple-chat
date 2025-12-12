import { FC } from 'react';
import { IBasePage } from './BasePage.declrarations';
import { StyledPageBody } from './BasePage.styles';
import { useMounted } from '@utils';

export const BasePage: FC<IBasePage> = ({ loadingElement, children }) => {
    const mounted = useMounted();

    if (!mounted) return null;

    return (
        <StyledPageBody>
            {loadingElement}
            {children}
        </StyledPageBody>
    );
};
