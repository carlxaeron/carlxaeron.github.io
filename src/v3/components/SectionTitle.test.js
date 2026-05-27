import { render, screen } from '@testing-library/react';
import SectionTitle from './SectionTitle';

describe('SectionTitle', () => {
  test('renders title, accent, and subtitle', () => {
    render(
      <SectionTitle accent="Us" subtitle="My professional journey">
        About
      </SectionTitle>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('About Us');
    expect(screen.getByText('My professional journey')).toBeInTheDocument();
  });

  test('renders title without optional props', () => {
    render(<SectionTitle>Contact</SectionTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact');
  });
});
