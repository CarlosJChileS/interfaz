import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-leaflet to avoid ESM issues in tests
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: ({ children }) => <div>{children}</div>,
}));
test('renders EcoGestor title', () => {
  render(<App />);
  const titleElement = screen.getByText(/EcoGestor Universitario/i);
  expect(titleElement).toBeInTheDocument();
});
