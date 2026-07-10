import { render, screen, fireEvent } from "@testing-library/react";
import V3Blog from "./Blog";

describe("V3Blog", () => {
  test("renders blog section with posts and filters", () => {
    render(<V3Blog isActive={true} />);

    expect(screen.getByText(/News & Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/Launching a local business website sideline/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "News" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Client Sites" })).toBeInTheDocument();
  });

  test("filters posts by category", () => {
    render(<V3Blog isActive={true} />);

    fireEvent.click(screen.getByRole("button", { name: "Client Sites" }));
    expect(screen.getByText(/RG Decals and Printing Shop/i)).toBeInTheDocument();
    expect(screen.queryByText(/Portfolio preview showcase/i)).not.toBeInTheDocument();
  });

  test("opens modal when a post is clicked", () => {
    render(<V3Blog isActive={true} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Read article: Launching a local business website sideline/i })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/starter websites for local businesses/i)).toBeInTheDocument();
  });
});
