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

  test("renders like and dislike actions", () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dislike" })).toBeInTheDocument();
  });

  test("submits like without comment", async () => {
    render(<PreviewFeedback previewSlug="machinemate" previewLabel="Machinemate" />);
    fireEvent.click(screen.getByRole("button", { name: "Like" }));

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
