import { maskClientSlug } from "./Insights";

describe("maskClientSlug", () => {
  it("masks middle of client slugs for public insights", () => {
    expect(maskClientSlug("g3k-cad")).toBe("g3****ad");
    expect(maskClientSlug("jk-construction")).toBe("jk****on");
    expect(maskClientSlug("kubling-tahanan")).toBe("ku****an");
  });

  it("fully masks very short slugs", () => {
    expect(maskClientSlug("ab")).toBe("****");
    expect(maskClientSlug("abcd")).toBe("****");
  });
});
