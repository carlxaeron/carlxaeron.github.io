import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PreviewFeedback from "./PreviewFeedback";

jest.mock("../utils/previewFeedback", () => ({
  hasSubmittedFeedback: jest.fn(() => false),
  submitPreviewFeedback: jest.fn(() => Promise.resolve({ status: 200 })),
}));

const { submitPreviewFeedback, hasSubmittedFeedback } = require("../utils/previewFeedback");

describe("PreviewFeedback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hasSubmittedFeedback.mockReturnValue(false);
  });

  test("renders like, dislike, and ready actions", () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dislike" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ready to proceed" })).toBeInTheDocument();
  });

  test("Like opens confirm modal without posting immediately", () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Like" }));

    expect(screen.getByRole("button", { name: /yes, i'm interested/i })).toBeInTheDocument();
    expect(submitPreviewFeedback).not.toHaveBeenCalled();
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
});
