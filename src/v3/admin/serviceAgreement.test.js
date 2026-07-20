import { TextDecoder, TextEncoder } from "util";
import {
  agreementValuesToPlaceholders,
  buildAgreementFilename,
  buildAgreementFormValues,
  fillServiceAgreementTemplate,
  formatPeso,
  indexClientCatalog,
  markdownToDocxBlob,
  markdownToPrintableHtml,
  parsePesoAmount,
  recalcAmountFields,
  splitDepositBalance,
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
});
