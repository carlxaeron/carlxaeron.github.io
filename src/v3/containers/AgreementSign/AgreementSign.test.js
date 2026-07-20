import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AgreementSign from "./AgreementSign";
import { extractAgreementBodyHtml, typedNameToSignatureDataUrl } from "./agreementApi";
import { mapping } from "../../../mapping";

jest.mock("react-helmet", () => ({
  Helmet: ({ children }) => <>{children}</>,
}));

const SAMPLE_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const TOKEN = "abc123token";

function installCanvasMock() {
  const ctx = {
    setTransform: jest.fn(),
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineCap: "",
    lineJoin: "",
    font: "",
    textBaseline: "",
  };
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ctx);
  HTMLCanvasElement.prototype.toDataURL = jest.fn(() => SAMPLE_PNG);
}

function mockAgreement(overrides = {}) {
  return {
    token: TOKEN,
    slug: "demo-co",
    businessName: "Demo Co",
    clientName: "Jane Client",
    filledHtml: "<article><h1>Service Agreement</h1><p>Terms for Demo Co.</p></article>",
    status: "viewed",
    signable: true,
    clientSignatoryName: null,
    clientSignatoryTitle: null,
    clientSignedAt: null,
    clientSignatureData: null,
    expiresAt: "2026-08-03T00:00:00+00:00",
    ...overrides,
  };
}

describe("extractAgreementBodyHtml", () => {
  test("returns fragment as-is", () => {
    expect(extractAgreementBodyHtml("<p>Hi</p>")).toBe("<p>Hi</p>");
  });

  test("extracts body from full document", () => {
    const html = `<!DOCTYPE html><html><head><title>X</title></head><body><h1>Deal</h1></body></html>`;
    expect(extractAgreementBodyHtml(html)).toBe("<h1>Deal</h1>");
  });
});

describe("typedNameToSignatureDataUrl", () => {
  beforeEach(() => {
    installCanvasMock();
  });

  test("returns png data url for a name", () => {
    const url = typedNameToSignatureDataUrl("Jane Client");
    expect(url).toMatch(/^data:image\/png;base64,/);
  });
});

describe("AgreementSign", () => {
  beforeEach(() => {
    installCanvasMock();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("loads agreement and renders document HTML", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 200, message: "OK", data: mockAgreement() }),
    });

    render(<AgreementSign token={TOKEN} />);

    expect(screen.getByTestId("agreement-sign-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-document")).toBeInTheDocument();
    });

    expect(screen.getByText("Service Agreement")).toBeInTheDocument();
    expect(screen.getByText("Terms for Demo Co.")).toBeInTheDocument();
    expect(screen.getByTestId("agreement-sign-form")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      `${mapping.agreementBase}/${TOKEN}`,
      expect.objectContaining({ method: "GET" })
    );
  });

  test("shows expired error for 410", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 410,
      json: async () => ({
        status: 400,
        message: "This agreement link has expired",
        data: { status: "expired" },
      }),
    });

    render(<AgreementSign token={TOKEN} />);

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-error")).toBeInTheDocument();
    });
    expect(screen.getByText(/This link has expired/i)).toBeInTheDocument();
    expect(screen.queryByTestId("agreement-sign-form")).not.toBeInTheDocument();
  });

  test("shows revoked error for 410 revoked", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 410,
      json: async () => ({
        status: 400,
        message: "This agreement link has been revoked",
        data: { status: "revoked" },
      }),
    });

    render(<AgreementSign token={TOKEN} />);

    await waitFor(() => {
      expect(screen.getByText(/This link has been revoked/i)).toBeInTheDocument();
    });
  });

  test("already signed shows read-only copy and print, hides form", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        status: 200,
        message: "OK",
        data: mockAgreement({
          status: "signed",
          signable: false,
          clientSignatoryName: "Jane Client",
          clientSignatoryTitle: "Owner",
          clientSignedAt: "2026-07-20T10:00:00+00:00",
          clientSignatureData: SAMPLE_PNG,
        }),
      }),
    });

    render(<AgreementSign token={TOKEN} />);

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-success")).toBeInTheDocument();
    });
    expect(screen.getByText(/already been signed/i)).toBeInTheDocument();
    expect(screen.queryByTestId("agreement-sign-form")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Print \/ Save as PDF/i }).length).toBeGreaterThan(0);
    expect(screen.getByAltText(/Signature of Jane Client/i)).toBeInTheDocument();
  });

  test("submits signature via typed-name fallback when pad empty", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: 200, message: "OK", data: mockAgreement() }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          message: "Agreement signed",
          data: mockAgreement({
            status: "signed",
            signable: false,
            clientSignatoryName: "Jane Client",
            clientSignatoryTitle: "Owner",
            clientSignedAt: "2026-07-20T10:00:00+00:00",
            clientSignatureData: SAMPLE_PNG,
          }),
        }),
      });

    render(<AgreementSign token={TOKEN} />);

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-form")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Printed name/i), {
      target: { value: "Jane Client" },
    });
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Owner" },
    });
    fireEvent.click(screen.getByTestId("agreement-sign-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-success")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${mapping.agreementBase}/${TOKEN}/sign`,
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"signatoryName":"Jane Client"'),
      })
    );

    const postBody = JSON.parse(global.fetch.mock.calls[1][1].body);
    expect(postBody.signatoryTitle).toBe("Owner");
    expect(postBody.signatureData).toMatch(/^data:image\/png;base64,/);
    expect(screen.getByText(/Thank you — your signed agreement has been submitted/i)).toBeInTheDocument();
    expect(screen.queryByTestId("agreement-sign-form")).not.toBeInTheDocument();
  });

  test("handles 409 by reloading signed agreement", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: 200, message: "OK", data: mockAgreement() }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          status: 400,
          message: "Agreement already signed",
          data: { status: "signed" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          message: "OK",
          data: mockAgreement({
            status: "signed",
            signable: false,
            clientSignatoryName: "Jane Client",
            clientSignatureData: SAMPLE_PNG,
            clientSignedAt: "2026-07-20T10:00:00+00:00",
          }),
        }),
      });

    render(<AgreementSign token={TOKEN} />);

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-form")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Printed name/i), {
      target: { value: "Jane Client" },
    });
    fireEvent.click(screen.getByTestId("agreement-sign-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("agreement-sign-success")).toHaveTextContent(/already been signed/i);
    });
    expect(screen.queryByTestId("agreement-sign-form")).not.toBeInTheDocument();
  });
});
