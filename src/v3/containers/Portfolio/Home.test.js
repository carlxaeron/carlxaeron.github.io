import { render, screen, fireEvent } from '@testing-library/react';
import V3Home from './Home';
import { PortfolioContentProvider } from '../../config/PortfolioContentContext';
import { PORTFOLIO_VARIANTS } from '../../config/portfolioVariant';

function renderHome(variant = PORTFOLIO_VARIANTS.RESULTS, props = {}) {
  return render(
    <PortfolioContentProvider variant={variant}>
      <V3Home onNavigate={props.onNavigate || jest.fn()} />
    </PortfolioContentProvider>
  );
}

describe('V3Home', () => {
  test('renders results hero copy and CTAs by default', () => {
    const onNavigate = jest.fn();
    renderHome(PORTFOLIO_VARIANTS.RESULTS, { onNavigate });

    expect(screen.getByText(/Senior engineer · 14 years in production/i)).toBeInTheDocument();
    expect(screen.getByText(/I build web apps for banks, media, and product teams/i)).toBeInTheDocument();
    expect(screen.getByText(/Carl Louis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /See the work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contact/i })).toBeInTheDocument();
  });

  test('renders resume hero copy when variant is resume', () => {
    renderHome(PORTFOLIO_VARIANTS.RESUME);

    expect(screen.getByText(/Building AI-Powered Enterprise Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/14\+ years architecting production-grade systems/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View My Work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get In Touch/i })).toBeInTheDocument();
  });

  test('renders animated geometric background shapes', () => {
    renderHome();
    expect(screen.getByTestId('home-shapes')).toBeInTheDocument();
    expect(document.querySelector('.v3-shape--orb-lg')).toBeInTheDocument();
    expect(document.querySelector('.v3-shape--hex svg')).toBeInTheDocument();
  });

  test('CTAs call onNavigate with correct section ids', () => {
    const onNavigate = jest.fn();
    renderHome(PORTFOLIO_VARIANTS.RESULTS, { onNavigate });

    fireEvent.click(screen.getByRole('button', { name: /See the work/i }));
    expect(onNavigate).toHaveBeenCalledWith('projects');

    fireEvent.click(screen.getByRole('button', { name: /Contact/i }));
    expect(onNavigate).toHaveBeenCalledWith('contact');
  });
});
