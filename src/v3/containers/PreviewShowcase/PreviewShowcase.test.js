import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PreviewShowcase, { PreviewShowcaseError, buildAdminPreviewUrl } from "./PreviewShowcase";
import { mapping } from "../../../mapping";

const MOBILE_CHROME_QUERY = "(max-width: 991px)";
const PREVIEW_HOST = "https://bamboo-grove-cafe.netlify.app";
const PREVIEW_SLUG = "quotation";
const XKR_HOST = "https://xkr-construction.netlify.app";
const XKR_SLUG = "xkr-construction";

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

function getSiteIframes() {
  return screen
    .getAllByTitle(/Site — (Desktop|Mobile) preview/i)
    .filter((el) => el.tagName === "IFRAME");
}

function openPreviewSettings() {
  fireEvent.click(screen.getByTestId("preview-settings-open"));
  return screen.getByTestId("preview-settings-panel");
}

describe("buildAdminPreviewUrl", () => {
  test("appends /admin/ without settings hash", () => {
    expect(buildAdminPreviewUrl("https://villa-clara-pool.netlify.app")).toBe(
      "https://villa-clara-pool.netlify.app/admin/"
    );
    expect(buildAdminPreviewUrl("https://example.netlify.app/")).toBe(
      "https://example.netlify.app/admin/"
    );
  });
});

describe("PreviewShowcase", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test("renders four preview frames (site + admin, desktop + mobile) on wide screens", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: false });

    render(
      <PreviewShowcase
        previewUrl={PREVIEW_HOST}
        label="Sample Business Quotation Site"
        previewSlug={PREVIEW_SLUG}
      />
    );

    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback-dock")).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
    expect(screen.getByText("Sample Business Quotation Site")).toBeInTheDocument();
    expect(screen.queryByText(/\.netlify\.app/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Business system \+ website sample/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Mobile preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Mobile preview/i)).toBeInTheDocument();
    const deviceLabels = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(deviceLabels.indexOf("Admin — Desktop")).toBeLessThan(deviceLabels.indexOf("Site — Desktop"));
    expect(screen.getAllByTitle(/preview of Sample Business/i)).toHaveLength(4);
    expect(screen.getByText(/Browse the admin system demo first/i)).toBeInTheDocument();
    expect(screen.queryByTestId("preview-settings-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("preview-view-mode")).not.toBeInTheDocument();
    expect(screen.queryByText(/Open live site/i)).not.toBeInTheDocument();

    restoreMatchMedia();
  });

  test("defaults to admin + site mobile frames on phone-width preview", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: true });

    render(
      <PreviewShowcase
        previewUrl={PREVIEW_HOST}
        label="Sample Business Quotation Site"
        previewSlug={PREVIEW_SLUG}
      />
    );

    expect(screen.getByTestId("preview-showcase")).toHaveClass("v3-preview-page--mobile-chrome");
    expect(screen.getByTestId("preview-showcase")).toHaveClass("v3-preview-page--mode-mobile");
    expect(screen.getByTestId("preview-view-mode")).toBeInTheDocument();
    expect(screen.getByText(/Browse the admin system demo and marketing site/i)).toBeInTheDocument();
    expect(screen.getByText(/Switch to Desktop for monitors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Mobile preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Mobile preview/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Admin — Desktop preview/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Site — Desktop preview/i)).not.toBeInTheDocument();
    const deviceLabels = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(deviceLabels.indexOf("Admin — Mobile")).toBeLessThan(deviceLabels.indexOf("Site — Mobile"));

    restoreMatchMedia();
  });

  test("switches to desktop monitor frames when Desktop view is selected", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: true });
    sessionStorage.removeItem(`previewViewMode:${PREVIEW_SLUG}`);

    render(
      <PreviewShowcase
        previewUrl={PREVIEW_HOST}
        label="Sample Business Quotation Site"
        previewSlug={PREVIEW_SLUG}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Desktop" }));

    expect(screen.getByTestId("preview-showcase")).toHaveClass("v3-preview-page--mode-desktop");
    expect(screen.getByLabelText(/Admin — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Desktop preview/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Admin — Mobile preview/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Site — Mobile preview/i)).not.toBeInTheDocument();
    expect(sessionStorage.getItem(`previewViewMode:${PREVIEW_SLUG}`)).toBe("desktop");

    restoreMatchMedia();
  });

  test("renders sticky feedback dock on mobile preview as collapsed toggle", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: true });

    render(
      <PreviewShowcase
        previewUrl={PREVIEW_HOST}
        label="Sample Business Quotation Site"
        previewSlug={PREVIEW_SLUG}
      />
    );

    expect(screen.getByTestId("preview-feedback-dock")).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback-toggle")).toBeInTheDocument();
    expect(screen.queryByText(/What do you think of this sample site/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("preview-feedback-toggle"));
    expect(screen.getByText(/What do you think of this sample site/i)).toBeInTheDocument();

    restoreMatchMedia();
  });

  test("admin iframes load /admin/ without settings hash", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: false });

    render(
      <PreviewShowcase
        previewUrl="https://villa-clara-pool.netlify.app"
        label="Villa Clara"
        previewSlug="villa-clara-pool"
      />
    );

    const adminFrames = screen
      .getAllByTitle(/Admin — (Desktop|Mobile) preview/i)
      .map((el) => el.getAttribute("src"));
    expect(adminFrames).toEqual([
      "https://villa-clara-pool.netlify.app/admin/",
      "https://villa-clara-pool.netlify.app/admin/",
    ]);

    restoreMatchMedia();
  });

  test("uses default title when label is omitted", () => {
    render(<PreviewShowcase previewUrl="https://example.netlify.app" />);
    expect(screen.getByRole("heading", { name: "Client site preview" })).toBeInTheDocument();
  });
});

describe("PreviewShowcase parent-owned preview settings", () => {
  let restoreMatchMedia;
  let originalFetch;

  beforeEach(() => {
    window.sessionStorage.clear();
    restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: false });
    originalFetch = global.fetch;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    restoreMatchMedia();
    global.fetch = originalFetch;
  });

  test("shows Customize button with Bootstrap tooltip; opens settings modal on click", async () => {
    render(
      <PreviewShowcase
        previewUrl={XKR_HOST}
        label="XKR Construction"
        previewSlug={XKR_SLUG}
      />
    );

    const openBtn = screen.getByTestId("preview-settings-open");
    expect(openBtn).toBeInTheDocument();
    expect(screen.queryByTestId("preview-settings-panel")).not.toBeInTheDocument();
    expect(
      screen.getByText(/Scroll inside the monitor to explore the marketing site/i)
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();

    fireEvent.focus(openBtn);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(/tweak this preview/i);

    openPreviewSettings();

    expect(screen.getByTestId("preview-settings-panel")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/Gallery photos shown/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hero background photo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Show Why agencies work with us/i)).toBeInTheDocument();
  });

  test("hides settings launcher when slug has no schema fields", () => {
    render(
      <PreviewShowcase
        previewUrl={PREVIEW_HOST}
        label="Sample"
        previewSlug={PREVIEW_SLUG}
      />
    );

    expect(screen.queryByTestId("preview-settings-open")).not.toBeInTheDocument();
    expect(screen.queryByTestId("preview-settings-panel")).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("does not GET previewSettings on mount", async () => {
    render(
      <PreviewShowcase
        previewUrl={XKR_HOST}
        label="XKR Construction"
        previewSlug={XKR_SLUG}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("preview-settings-open")).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("changing a setting posts APPLY to site iframes only", () => {
    render(
      <PreviewShowcase
        previewUrl={XKR_HOST}
        label="XKR Construction"
        previewSlug={XKR_SLUG}
      />
    );

    openPreviewSettings();

    const siteFrames = getSiteIframes();
    expect(siteFrames).toHaveLength(2);

    const sitePostMessages = siteFrames.map((iframe) => {
      const postMessage = jest.fn();
      Object.defineProperty(iframe, "contentWindow", {
        configurable: true,
        value: { postMessage },
      });
      return postMessage;
    });

    const adminFrames = screen
      .getAllByTitle(/Admin — (Desktop|Mobile) preview/i)
      .filter((el) => el.tagName === "IFRAME");
    const adminSpies = adminFrames.map((iframe) =>
      jest.spyOn(iframe.contentWindow, "postMessage")
    );

    fireEvent.change(screen.getByLabelText(/Gallery photos shown/i), {
      target: { value: "2" },
    });

    const expectedPayload = {
      type: "cm:preview-settings:apply",
      slug: XKR_SLUG,
      settings: {
        galleryCount: 2,
        heroImage: "project-01",
        showWhyUs: true,
      },
    };

    sitePostMessages.forEach((postMessage) => {
      expect(postMessage).toHaveBeenCalledWith(expectedPayload, XKR_HOST);
    });
    adminSpies.forEach((spy) => {
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  test("site iframe load posts APPLY with current settings", () => {
    render(
      <PreviewShowcase
        previewUrl={XKR_HOST}
        label="XKR Construction"
        previewSlug={XKR_SLUG}
      />
    );

    const siteFrames = getSiteIframes();
    const postMessage = jest.fn();
    Object.defineProperty(siteFrames[0], "contentWindow", {
      configurable: true,
      value: { postMessage },
    });

    fireEvent.load(siteFrames[0]);

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: "cm:preview-settings:apply",
        slug: XKR_SLUG,
        settings: {
          galleryCount: 4,
          heroImage: "project-01",
          showWhyUs: true,
        },
      },
      XKR_HOST
    );
  });

  test("Save POSTs previewSettings and shows Sent to Carl", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 200 }),
    });

    render(
      <PreviewShowcase
        previewUrl={XKR_HOST}
        label="XKR Construction"
        previewSlug={XKR_SLUG}
      />
    );

    openPreviewSettings();
    fireEvent.click(screen.getByTestId("preview-settings-save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        mapping.previewSettings,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const postBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(postBody).toMatchObject({
      previewSlug: XKR_SLUG,
      settings: {
        galleryCount: 4,
        heroImage: "project-01",
        showWhyUs: true,
      },
    });
    expect(typeof postBody.visitorId).toBe("string");
    expect(typeof postBody.sessionId).toBe("string");

    await waitFor(() => {
      expect(screen.getByTestId("preview-settings-save")).toHaveTextContent(/Sent to Carl/i);
    });

    expect(
      global.fetch.mock.calls.every(
        ([url, options]) =>
          !(typeof url === "string" && url.includes("?slug=") && (!options || !options.method))
      )
    ).toBe(true);
  });

  test("closes settings modal", async () => {
    render(
      <PreviewShowcase
        previewUrl={XKR_HOST}
        label="XKR Construction"
        previewSlug={XKR_SLUG}
      />
    );

    openPreviewSettings();
    fireEvent.click(screen.getByRole("button", { name: /Close settings/i }));
    await waitFor(() => {
      expect(screen.queryByTestId("preview-settings-panel")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("preview-settings-open")).toBeInTheDocument();
  });
});

describe("PreviewShowcaseError", () => {
  test("shows error when preview key not allowed", () => {
    render(<PreviewShowcaseError previewKey="evil.com" />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
    expect(screen.getByText(/Preview not available/i)).toBeInTheDocument();
    expect(screen.getByText(/evil.com/i)).toBeInTheDocument();
    expect(screen.queryByText(/netlify/i)).not.toBeInTheDocument();
  });

  test("shows slug-friendly hint when preview key is missing", () => {
    render(<PreviewShowcaseError previewKey={null} />);
    expect(screen.getByText(/Use \?preview=client-slug/i)).toBeInTheDocument();
    expect(screen.getByText(/machinemate/i)).toBeInTheDocument();
    expect(screen.queryByText(/netlify/i)).not.toBeInTheDocument();
  });
});
