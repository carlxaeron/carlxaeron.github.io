import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PreviewFeedback from "./PreviewFeedback";

jest.mock("../utils/previewFeedback", () => ({
  hasSubmittedFeedback: jest.fn(() => false),
  submitPreviewFeedback: jest.fn(() => Promise.resolve({ status: 200 })),
}));

const { submitPreviewFeedback, hasSubmittedFeedback } = require("../utils/previewFeedback");

const MOBILE_FEEDBACK_QUERY = "(max-width: 991px)";

function mockMatchMedia(matchesByQuery) {
  const originalMatchMedia = window.matchMedia;

  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: Boolean(matchesByQuery[query]),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

function expandMobileFeedback() {
  fireEvent.click(screen.getByTestId("preview-feedback-toggle"));
}

describe("PreviewFeedback", () => {
  let restoreMatchMedia;

  beforeEach(() => {
    jest.clearAllMocks();
    hasSubmittedFeedback.mockReturnValue(false);
    // Desktop by default — full bar visible (existing flows unchanged)
    restoreMatchMedia = mockMatchMedia({ [MOBILE_FEEDBACK_QUERY]: false });
  });

  afterEach(() => {
    restoreMatchMedia();
  });

  test("renders like, dislike, and ready actions", () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dislike" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ready to proceed" })).toBeInTheDocument();
  });

  test("on mobile collapses to Feedback button until expanded", () => {
    restoreMatchMedia();
    restoreMatchMedia = mockMatchMedia({ [MOBILE_FEEDBACK_QUERY]: true });

    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);

    expect(screen.getByTestId("preview-feedback-toggle")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Like" })).not.toBeInTheDocument();
    expect(screen.queryByText(/What do you think of this sample site/i)).not.toBeInTheDocument();

    expandMobileFeedback();

    expect(screen.getByText(/What do you think of this sample site/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback-collapse")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("preview-feedback-collapse"));
    expect(screen.getByTestId("preview-feedback-toggle")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Like" })).not.toBeInTheDocument();
  });

  test("Like opens confirm modal without posting immediately", () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Like" }));

    // className is on the outer .modal (react-bootstrap); data-testid lands on .modal-dialog
    expect(document.querySelector(".v3-preview-feedback-modal.modal")).toBeTruthy();
    expect(document.querySelector(".v3-preview-feedback-modal__content")).toBeTruthy();
    expect(screen.getByTestId("preview-feedback-confirm-modal")).toBeInTheDocument();
    expect(screen.getByText("Ready to move forward?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes, i'm interested/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Not yet" })).toBeInTheDocument();
    expect(submitPreviewFeedback).not.toHaveBeenCalled();
  });

  test("Dislike modal uses the same designed modal class", () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Dislike" }));

    expect(document.querySelector(".v3-preview-feedback-modal.modal")).toBeTruthy();
    expect(document.querySelector(".v3-preview-feedback-modal__content")).toBeTruthy();
    expect(screen.getByTestId("preview-feedback-dislike-modal")).toBeInTheDocument();
    expect(screen.getByText("Tell us what to improve")).toBeInTheDocument();
  });

  test("confirm Yes posts agree sentiment", async () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Like" }));
    fireEvent.click(screen.getByRole("button", { name: /yes, i'm interested/i }));

    await waitFor(() => {
      expect(submitPreviewFeedback).toHaveBeenCalledWith({
        previewSlug: "machinemate",
        previewLabel: "Machinemate",
        sentiment: "agree",
        comment: "",
      });
      expect(screen.getByTestId("preview-feedback-thanks")).toBeInTheDocument();
    });
  });

  test("Not yet from Like posts like sentiment", async () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Like" }));
    fireEvent.click(screen.getByRole("button", { name: "Not yet" }));

    await waitFor(() => {
      expect(submitPreviewFeedback).toHaveBeenCalledWith({
        previewSlug: "machinemate",
        previewLabel: "Machinemate",
        sentiment: "like",
        comment: "",
      });
      expect(screen.getByTestId("preview-feedback-thanks")).toBeInTheDocument();
    });
  });

  test("Ready to proceed opens confirm; Not yet closes without POST", async () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to proceed" }));

    expect(screen.getByRole("button", { name: /yes, i'm interested/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Not yet" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /yes, i'm interested/i })).not.toBeInTheDocument();
    });
    expect(submitPreviewFeedback).not.toHaveBeenCalled();
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
  });

  test("Ready Yes posts agree sentiment", async () => {
    render(<PreviewFeedback previewSlug="jk-construction" previewLabel="JK Construction" />);
    fireEvent.click(screen.getByRole("button", { name: "Ready to proceed" }));
    fireEvent.click(screen.getByRole("button", { name: /yes, i'm interested/i }));

    await waitFor(() => {
      expect(submitPreviewFeedback).toHaveBeenCalledWith({
        previewSlug: "jk-construction",
        previewLabel: "JK Construction",
        sentiment: "agree",
        comment: "",
      });
    });
  });

  test("requires comment before dislike submit", async () => {
    render(<PreviewFeedback previewSlug="jk-construction" previewLabel="JK Construction" />);
    fireEvent.click(screen.getByRole("button", { name: "Dislike" }));

    expect(screen.getByText(/comment is required/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Submit dislike" }));

    expect(submitPreviewFeedback).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Needs more photos" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit dislike" }));

    await waitFor(() => {
      expect(submitPreviewFeedback).toHaveBeenCalledWith({
        previewSlug: "jk-construction",
        previewLabel: "JK Construction",
        sentiment: "dislike",
        comment: "Needs more photos",
      });
    });
  });

  test("mobile: expand then Like still opens confirm", () => {
    restoreMatchMedia();
    restoreMatchMedia = mockMatchMedia({ [MOBILE_FEEDBACK_QUERY]: true });

    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    expandMobileFeedback();
    fireEvent.click(screen.getByRole("button", { name: "Like" }));

    expect(screen.getByTestId("preview-feedback-confirm-modal")).toBeInTheDocument();
    expect(submitPreviewFeedback).not.toHaveBeenCalled();
  });
});
