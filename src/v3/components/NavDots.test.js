import { render, screen, fireEvent } from '@testing-library/react';
import NavDots from './NavDots';

jest.mock('../containers/Portfolio/theme-provider', () => ({
  useStore: (selector) => selector({ value: { isMobile: false } }),
}));

const SECTIONS = [
  { id: 'home', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'skills', title: 'Skills' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'contact', title: 'Contact' },
];

describe('NavDots', () => {
  test('renders six nav dots with aria labels', () => {
    render(
      <NavDots sections={SECTIONS} currentSection={0} onNavigate={jest.fn()} />
    );

    expect(screen.getByRole('navigation', { name: /Section navigation/i })).toBeInTheDocument();
    SECTIONS.forEach((section) => {
      expect(screen.getByRole('button', { name: `Go to ${section.title}` })).toBeInTheDocument();
    });
  });

  test('calls onNavigate when a dot is clicked', () => {
    const onNavigate = jest.fn();
    render(
      <NavDots sections={SECTIONS} currentSection={0} onNavigate={onNavigate} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to Skills' }));
    expect(onNavigate).toHaveBeenCalledWith(2);
  });

  test('marks active dot with aria-current', () => {
    render(
      <NavDots sections={SECTIONS} currentSection={2} onNavigate={jest.fn()} />
    );

    expect(screen.getByRole('button', { name: 'Go to Skills' })).toHaveAttribute('aria-current', 'step');
  });
});
