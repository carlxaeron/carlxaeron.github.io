import { render, screen, fireEvent } from '@testing-library/react';
import V3Home from './Home';

describe('V3Home', () => {
  test('renders enterprise hero copy and CTAs', () => {
    const onNavigate = jest.fn();
    render(<V3Home onNavigate={onNavigate} />);

    expect(screen.getByText(/Senior Full-Stack Engineer · AI Integration Specialist/i)).toBeInTheDocument();
    expect(screen.getByText(/Carl Louis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View My Work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get In Touch/i })).toBeInTheDocument();
  });

  test('CTAs call onNavigate with correct section indices', () => {
    const onNavigate = jest.fn();
    render(<V3Home onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /View My Work/i }));
    expect(onNavigate).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /Get In Touch/i }));
    expect(onNavigate).toHaveBeenCalledWith(5);
  });
});
