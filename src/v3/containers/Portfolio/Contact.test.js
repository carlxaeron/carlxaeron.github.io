import { render, screen } from '@testing-library/react';
import V3Contact from './Contact';

jest.mock('./theme-provider', () => ({
  useStore: () => ({
    setValue: jest.fn(),
  }),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('V3Contact', () => {
  test('renders enterprise intro and form fields', () => {
    render(<V3Contact isActive={true} />);

    expect(
      screen.getByText(/Looking to build an enterprise-grade platform or integrate AI into your product/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  test('renders contact info links', () => {
    render(<V3Contact isActive={true} />);

    expect(screen.getByText('info@carlmanuel.com')).toBeInTheDocument();
    expect(screen.getByText('github.com/carlxaeron')).toBeInTheDocument();
  });
});
