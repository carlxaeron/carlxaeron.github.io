import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatAgent from "./ChatAgent";

jest.mock("../config", () => ({
  logEvent: jest.fn(),
}));

jest.mock("axios", () => ({
  post: jest.fn(() => Promise.resolve({ data: { data: [] } })),
}));

const axios = require("axios");

describe("ChatAgent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders chat FAB and opens modal", () => {
    render(<ChatAgent />);

    expect(
      screen.getByRole("button", { name: /Chat with AI assistant/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Chat with AI assistant/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
    expect(document.body).toHaveClass("v3-modal-open");
  });

  test("does not call API when submitting empty message", async () => {
    render(<ChatAgent />);

    fireEvent.click(screen.getByRole("button", { name: /Chat with AI assistant/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Send$/i }));

    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /^Send$/i })).not.toBeDisabled();
  });

  test("sends message and displays assistant reply", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        data: [{ message: { content: "I specialize in React and Laravel." } }],
      },
    });

    render(<ChatAgent />);

    fireEvent.click(screen.getByRole("button", { name: /Chat with AI assistant/i }));

    const input = screen.getByPlaceholderText(/Type your message here/i);
    fireEvent.change(input, { target: { value: "What are your skills?" } });
    fireEvent.click(screen.getByRole("button", { name: /^Send$/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(
      await screen.findByText(/I specialize in React and Laravel/i)
    ).toBeInTheDocument();
  });

  test("closes modal on Escape and removes body lock", async () => {
    render(<ChatAgent />);

    fireEvent.click(screen.getByRole("button", { name: /Chat with AI assistant/i }));
    expect(document.body).toHaveClass("v3-modal-open");

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.body).not.toHaveClass("v3-modal-open");
  });

  test("closes modal with header close button", async () => {
    render(<ChatAgent />);

    fireEvent.click(screen.getByRole("button", { name: /Chat with AI assistant/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /^Close$/i })[0]);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("closes modal with footer close button", async () => {
    render(<ChatAgent />);

    fireEvent.click(screen.getByRole("button", { name: /Chat with AI assistant/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /^Close$/i })[1]);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
