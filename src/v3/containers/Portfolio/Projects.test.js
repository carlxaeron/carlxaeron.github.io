import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import V3Projects from "./Projects";

jest.mock("../../../config", () => ({
  logEvent: jest.fn(),
  analytics: {},
}));

describe("V3Projects", () => {
  test("loads project images with direct src when section is active", async () => {
    render(<V3Projects isActive={true} />);

    await waitFor(() => {
      const img = screen.getByAltText("AppKey");
      expect(img).toHaveAttribute("src", "/static/images/sites/resized-images/mb1.png");
      expect(img.getAttribute("data-src")).toBeNull();
    });
  });

  test("does not render projects without a valid id", () => {
    render(<V3Projects isActive={true} />);
    expect(screen.queryByAltText("Project")).not.toBeInTheDocument();
  });

  test("opens modal with full-size image and AppKey details on thumb click", async () => {
    render(<V3Projects isActive={true} />);

    await waitFor(() => {
      expect(screen.getByAltText("AppKey")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /View project: AppKey/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Metrobank — AppKey/i)).toBeInTheDocument();

    const heroLink = screen.getByRole("link", { name: /Open full-size image for AppKey/i });
    const heroImg = heroLink.querySelector("img");
    expect(heroImg).toHaveAttribute("src", "/static/images/sites/mb1.png");
    expect(heroImg.getAttribute("src")).not.toContain("resized-images");

    expect(screen.getByText(/MB AppKey feature front-end development/i)).toBeInTheDocument();
    expect(screen.getByText("#reactJS")).toBeInTheDocument();
  });

  test("shows Visit Site link for projects with websiteUrl", async () => {
    render(<V3Projects isActive={true} />);

    await waitFor(() => {
      expect(screen.getByAltText("Star Cinema")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /View project: Star Cinema/i }));

    const visitLink = await screen.findByRole("link", { name: /Visit Site/i });
    expect(visitLink).toHaveAttribute("href", "https://starcinema.abs-cbn.com/");
  });

  test("closes modal when Close is clicked", async () => {
    render(<V3Projects isActive={true} />);

    await waitFor(() => {
      expect(screen.getByAltText("AppKey")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /View project: AppKey/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const closeBtn = dialog.querySelector(".v3-project-modal__close");
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
