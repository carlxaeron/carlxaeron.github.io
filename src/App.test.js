import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/ChatAgent', () => () => null);

jest.mock('./pages/Index', () => () => (
  <div>
    <p>Senior Full-Stack Engineer · AI Integration Specialist</p>
    <h1>Carl Louis Manuel</h1>
  </div>
));

describe('App', () => {
  test('renders V3 portfolio shell', () => {
    render(<App />);
    expect(screen.getByText(/Senior Full-Stack Engineer · AI Integration Specialist/i)).toBeInTheDocument();
    expect(screen.getByText(/Carl Louis Manuel/i)).toBeInTheDocument();
  });
});
