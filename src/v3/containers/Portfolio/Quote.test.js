import { render, screen, fireEvent } from "@testing-library/react";
import V3Quote from "./Quote";

jest.mock("./theme-provider", () => ({
  useStore: () => ({
    setValue: jest.fn(),
  }),
}));

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe("V3Quote", () => {
  test("renders quote form with PHP budget ranges by default", () => {
    render(<V3Quote isActive={true} />);

    expect(screen.getByRole("heading", { name: /Get a Quote/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget range \(PHP\)/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "< ₱50k" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "< $1k" })).not.toBeInTheDocument();
  });

  test("switches budget ranges when currency changes", () => {
    render(<V3Quote isActive={true} />);

    fireEvent.click(screen.getByRole("button", { name: "USD" }));

    expect(screen.getByLabelText(/Budget range \(USD\)/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "< $1k" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "< ₱50k" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "USD" })).toHaveAttribute("aria-pressed", "true");
  });

  test("clears budget selection when currency changes", () => {
    render(<V3Quote isActive={true} />);

    fireEvent.change(screen.getByLabelText(/Budget range \(PHP\)/i), {
      target: { value: "₱50k–₱150k" },
    });
    fireEvent.click(screen.getByRole("button", { name: "USD" }));

    expect(screen.getByLabelText(/Budget range \(USD\)/i)).toHaveValue("");
  });
});
