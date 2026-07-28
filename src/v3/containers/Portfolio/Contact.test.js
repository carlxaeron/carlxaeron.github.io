import { render, screen } from '@testing-library/react';
import V3Contact from './Contact';
import { PortfolioContentProvider } from '../../config/PortfolioContentContext';
import { PORTFOLIO_VARIANTS } from '../../config/portfolioVariant';

jest.mock('./theme-provider', () => ({
  useStore: () => ({
    setValue: jest.fn(),
  }),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

function renderContact(variant = PORTFOLIO_VARIANTS.RESULTS) {
  return render(
    <PortfolioContentProvider variant={variant}>
      <V3Contact isActive={true} />
    </PortfolioContentProvider>
  );
}

describe('V3Contact', () => {
  test('renders results intro and form fields by default', () => {
    renderContact();

    expect(
      screen.getByText(/Remote roles and contract work welcome/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  test('renders resume intro when variant is resume', () => {
    renderContact(PORTFOLIO_VARIANTS.RESUME);
    expect(
      screen.getByText(/Looking to build an enterprise-grade platform or integrate AI into your product/i)
    ).toBeInTheDocument();
  });

  test('renders contact info links', () => {
    renderContact();

    expect(screen.getByText('info@carlmanuel.com')).toBeInTheDocument();
    expect(screen.getByText('github.com/carlxaeron')).toBeInTheDocument();
  });
});
