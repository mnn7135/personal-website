import Page from '@/app/projects/astronomy/page';
import '@testing-library/jest-dom';
import { act } from 'react';
import { render, screen } from '@testing-library/react';

// Run Tests
describe('simple rendering test', () => {
    it('renders the home page', async () => {
        await act(async () => {
            render(<Page />);
        });

        const actual = screen.getByText('Astronomy');

        expect(actual).toBeInTheDocument();
    });
});
