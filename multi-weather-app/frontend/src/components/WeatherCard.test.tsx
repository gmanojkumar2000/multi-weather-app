import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';

import App from '../App';

describe('App', () => {
  it('renders an accessible city search', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText(/city search/i)).toBeInTheDocument();
  });
});
