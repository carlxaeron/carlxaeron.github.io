import { TextDecoder, TextEncoder } from "util";
import {
  agreementValuesToPlaceholders,
  buildAgreementFilename,
  buildAgreementFormValues,
  buildAgreementSendPayload,
  extractAgreementArticleHtml,
  fillServiceAgreementTemplate,
  formatPeso,
  generateServiceAgreementDownloads,
  indexClientCatalog,
  isValidClientEmail,
  markdownToDocxBlob,
  markdownToPrintableHtml,
  parsePesoAmount,
  recalcAmountFields,
  splitDepositBalance,
  stripInternalAgreementSections,
} from "./serviceAgreement";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

describe("serviceAgreement helpers", () => {
  test("parsePesoAmount and formatPeso handle Philippine peso strings", () => {
    expect(parsePesoAmount("₱15,000")).toBe(15000);
    expect(parsePesoAmount("18000")).toBe(18000);
    expect(formatPeso(15000)).toBe("₱15,000");
  });

  test("splitDepositBalance computes 50/50 deposit and balance", () => {
    expect(splitDepositBalance("₱15,000")).toEqual({
      deposit: "₱7,500",
      balance: "₱7,500",
      total: "₱15,000",
    });
    expect(splitDepositBalance("₱18,001")).toEqual({
      deposit: "₱9,001",
      balance: "₱9,000",
      total: "₱18,001",
    });
  });

  test("buildAgreementFormValues merges site, outreach, and catalog entry", () => {
    const values = buildAgreementFormValues({
      site: { id: "jk-construction", label: "JK Construction Services" },
      outreach: {
        slug: "jk-construction",
        business_name: "JK Construction Services",
        contact_name: "JK team",
        contact_email: "jk@example.com",
        quoted_amount: "₱15,000",
        package_name: "Starter Business Website",
        timeline: "5–7 business days after content approval",
      },
      catalogEntry: {
        slug: "jk-construction",
        businessName: "JK Construction Services",
        industry: "Construction",
        contact: {
          name: "JK Construction Services team",
          email: "jkconstructionservices@yahoo.com",
          phone: "+63 926 658 6754",
        },
        quotation: {
          packageName: "Starter Business Website",
          quotedAmount: "₱15,000",
          timeline: "5–7 business days after content approval",
          previewUrl: "https://carlmanuel.com/?preview=jk-construction",
        },
        system: {
          type: "service",
          label: "Job schedule admin",
          adminPath: "/admin/",
          navPages: ["Dashboard", "Jobs", "Settings"],
        },
        sources: { address: "Caloocan, Philippines" },
      },
      now: new Date("2026-07-20T00:00:00.000Z"),
    });

    expect(values.slug).toBe("jk-construction");
    expect(values.businessName).toBe("JK Construction Services");
    expect(values.clientEmail).toBe("jkconstructionservices@yahoo.com");
    expect(values.depositAmount).toBe("₱7,500");
    expect(values.systemNavPages).toBe("Dashboard, Jobs, Settings");
    expect(values.previewUrl).toBe("https://carlmanuel.com/?preview=jk-construction");
  });

  test("fillServiceAgreementTemplate replaces all placeholders", () => {
    const template = "Hello {{BUSINESS_NAME}} · {{DEPOSIT_AMOUNT}} · {{SLUG}}";
    const filled = fillServiceAgreementTemplate(template, {
      businessName: "Demo Biz",
      depositAmount: "₱7,500",
      slug: "demo-biz",
    });
    expect(filled).toBe("Hello Demo Biz · ₱7,500 · demo-biz");
    expect(filled).not.toMatch(/\{\{/);
  });

  test("agreementValuesToPlaceholders maps form keys to template tokens", () => {
    const placeholders = agreementValuesToPlaceholders({
      businessName: "Demo Biz",
      quotedAmount: "₱15,000",
      slug: "demo-biz",
    });
    expect(placeholders.BUSINESS_NAME).toBe("Demo Biz");
    expect(placeholders.QUOTED_AMOUNT).toBe("₱15,000");
    expect(placeholders.SLUG).toBe("demo-biz");
    expect(placeholders.PROVIDER_LEGAL_NAME).toBe(
      "CarlManuel Software Development Services"
    );
    expect(placeholders.PROVIDER_SIGNATORY_NAME).toBe("Carl Louis Manuel");
  });

  test("buildAgreementFilename uses slug and date", () => {
    expect(
      buildAgreementFilename("jk-construction", "md", new Date("2026-07-20T00:00:00.000Z"))
    ).toBe("jk-construction-service-agreement-2026-07-20.md");
    expect(
      buildAgreementFilename("jk-construction", "docx", new Date("2026-07-20T00:00:00.000Z"))
    ).toBe("jk-construction-service-agreement-2026-07-20.docx");
  });

  test("markdownToDocxBlob returns a Blob for Word download", async () => {
    const blob = await markdownToDocxBlob(
      "# Title\n\nHello **world**\n\n| A | B |\n|---|---|\n| 1 | 2 |\n",
      "Test Agreement"
    );
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(500);
  });

  test("recalcAmountFields updates deposit and balance when quoted amount changes", () => {
    const next = recalcAmountFields({ slug: "demo" }, "₱18,000");
    expect(next.quotedAmount).toBe("₱18,000");
    expect(next.depositAmount).toBe("₱9,000");
    expect(next.balanceAmount).toBe("₱9,000");
  });

  test("indexClientCatalog indexes by slug", () => {
    const map = indexClientCatalog([
      { slug: "a" },
      { slug: "b" },
    ]);
    expect(map.a.slug).toBe("a");
    expect(map.b.slug).toBe("b");
  });

  test("markdownToPrintableHtml renders headings and tables", () => {
    const html = markdownToPrintableHtml(
      "# Title\n\n| A | B |\n|---|---|\n| 1 | 2 |",
      "Test Agreement"
    );
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
    expect(html).toContain("<title>Test Agreement</title>");
  });

  test("markdownToPrintableHtml does not leave stray t; before blockquote Disclaimer", () => {
    const html = markdownToPrintableHtml(
      "> **Disclaimer:** This is a template only.\n\n> **Pricing note:** Website only.",
      "Disclaimer Test"
    );
    expect(html).toContain("<blockquote><strong>Disclaimer:</strong> This is a template only.</blockquote>");
    expect(html).toContain("<blockquote><strong>Pricing note:</strong> Website only.</blockquote>");
    expect(html).not.toMatch(/t;\s*<strong>Disclaimer/);
    expect(html).not.toContain("t; Disclaimer");
    expect(html).not.toContain("&gt;");
  });

  test("stripInternalAgreementSections removes How to use this template", () => {
    const markdown = [
      "# Client Service Agreement",
      "",
      "> **Disclaimer:** Template only.",
      "",
      "---",
      "",
      "## How to use this template",
      "",
      "1. Copy this file.",
      "2. Replace placeholders from `client-sites/{slug}/client.json`.",
      "",
      "---",
      "",
      "# SERVICE AGREEMENT",
      "",
      "Parties agree.",
    ].join("\n");

    const stripped = stripInternalAgreementSections(markdown);
    expect(stripped).toContain("Disclaimer");
    expect(stripped).toContain("# SERVICE AGREEMENT");
    expect(stripped).not.toContain("How to use this template");
    expect(stripped).not.toContain("client-sites/{slug}/");

    const html = markdownToPrintableHtml(stripped, "Client Facing");
    expect(html).not.toContain("How to use this template");
    expect(html).not.toContain("client-sites/{slug}/");
    expect(html).toContain("<blockquote><strong>Disclaimer:</strong> Template only.</blockquote>");
    expect(html).not.toMatch(/t;\s*<strong>Disclaimer/);
  });

  test("generateServiceAgreementDownloads strips How to use from client HTML", async () => {
    const template = [
      "# Client Service Agreement",
      "",
      "> **Disclaimer:** Template only for {{BUSINESS_NAME}}.",
      "",
      "## How to use this template",
      "",
      "Replace from `client-sites/{slug}/client.json`.",
      "",
      "---",
      "",
      "# SERVICE AGREEMENT",
      "",
      "Hello {{BUSINESS_NAME}}.",
    ].join("\n");

    const { html, markdown } = await generateServiceAgreementDownloads(
      { businessName: "Bamboo Grove", slug: "bamboo-grove" },
      template
    );
    const article = extractAgreementArticleHtml(html);

    expect(markdown).not.toContain("How to use this template");
    expect(markdown).not.toContain("client-sites/{slug}/");
    expect(article).not.toContain("How to use this template");
    expect(article).not.toContain("client-sites/{slug}/");
    expect(article).toContain("Bamboo Grove");
    expect(article).toContain("<blockquote><strong>Disclaimer:</strong>");
    expect(article).not.toMatch(/t;\s*<strong>Disclaimer/);
  });

  test("extractAgreementArticleHtml wraps printable body in article", () => {
    const printable = markdownToPrintableHtml("# Hello\n\nBody copy", "T");
    const article = extractAgreementArticleHtml(printable);
    expect(article.startsWith("<article")).toBe(true);
    expect(article).toContain("<h1>Hello</h1>");
    expect(article).not.toContain("<!DOCTYPE");
    expect(extractAgreementArticleHtml("<article><p>x</p></article>")).toBe(
      "<article><p>x</p></article>"
    );
  });

  test("isValidClientEmail and buildAgreementSendPayload", () => {
    expect(isValidClientEmail("client@example.com")).toBe(true);
    expect(isValidClientEmail("not-an-email")).toBe(false);

    const payload = buildAgreementSendPayload(
      {
        slug: "jk-construction",
        businessName: "JK Construction",
        clientEmail: " Client@Example.com ",
        clientSignatoryName: "Juan",
        quotedAmount: "₱15,000",
      },
      "<article>ok</article>"
    );

    expect(payload).toEqual({
      slug: "jk-construction",
      businessName: "JK Construction",
      clientEmail: "client@example.com",
      clientName: "Juan",
      formJson: {
        slug: "jk-construction",
        businessName: "JK Construction",
        clientEmail: " Client@Example.com ",
        clientSignatoryName: "Juan",
        quotedAmount: "₱15,000",
      },
      filledHtml: "<article>ok</article>",
    });
  });
});
