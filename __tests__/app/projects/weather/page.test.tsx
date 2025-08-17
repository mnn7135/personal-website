import Page from '@/app/projects/weather/page';
import '@testing-library/jest-dom';
import { act } from 'react';
import { render, screen } from '@testing-library/react';

// Setup Mocks
const resizeObserverMock = () => ({
    disconnect: jest.fn(),
    observe: jest.fn()
});

window.ResizeObserver = jest.fn().mockImplementation(resizeObserverMock);

// Run Tests
describe('simple rendering test', () => {
    it('renders the home page', async () => {
        await act(async () => {
            render(<Page />);
        });

        const actual = screen.getByText('Weather | Phoenix Station');

        expect(actual).toBeInTheDocument();
    });
});
