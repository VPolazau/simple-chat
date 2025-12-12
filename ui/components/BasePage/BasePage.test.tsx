import React from 'react';
import { render, screen } from '@testing-library/react';
import { BasePage } from './BasePage';
import '@testing-library/jest-dom';

jest.mock('@utils', () => {
    return {
        useMounted: jest.fn(),
        tabletScreen: (strings: TemplateStringsArray) => strings.join(''),
        mobileScreen: (strings: TemplateStringsArray) => strings.join(''),
    };
});

describe('BasePage', () => {
    const useMounted = require('@utils').useMounted as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render anything if not mounted', () => {
        useMounted.mockReturnValue(false);
        const { container } = render(<BasePage loadingElement={<div>Loading...</div>}>Content</BasePage>);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders loadingElement and children when mounted', () => {
        useMounted.mockReturnValue(true);
        render(<BasePage loadingElement={<div>Loading...</div>}>Content</BasePage>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
