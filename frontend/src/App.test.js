import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EcoGestor title', () => {
  render(<App />);
  const titleElement = screen.getByText(/EcoGestor Universitario/i);
  expect(titleElement).toBeInTheDocument();
});
