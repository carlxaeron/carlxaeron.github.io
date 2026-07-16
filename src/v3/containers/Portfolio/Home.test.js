import { render, screen, fireEvent } from '@testing-library/react';
import V3Home from './Home';

describe('V3Home', () => {
  test('renders enterprise hero copy and CTAs', () => {
    const onNavigate = jest.fn();
    render(<V3Home onNavigate={onNavigate} />);

    expect(screen.getByText(/Building AI-Powered Enterprise Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/12\+ years architecting production-grade systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Carl Louis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View My Work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get In Touch/i })).toBeInTheDocument();
  });

  test('renders animated geometric background shapes', () => {
    render(<V3Home onNavigate={jest.fn()} />);
    expect(screen.getByTestId('home-shapes')).toBeInTheDocument();
    expect(document.querySelector('.v3-shape--orb-lg')).toBeInTheDocument();
    expect(document.querySelector('.v3-shape--hex svg')).toBeInTheDocument();
  });

  test('CTAs call onNavigate with correct section ids', () => {
    const onNavigate = jest.fn();
    render(<V3Home onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /View My Work/i }));
    expect(onNavigate).toHaveBeenCalledWith('projects');

    fireEvent.click(screen.getByRole('button', { name: /Get In Touch/i }));
    expect(onNavigate).toHaveBeenCalledWith('contact');
  });
});
