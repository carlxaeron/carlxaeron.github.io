import { Helmet } from "react-helmet";
import { getPortfolioSeo, shouldNoIndex } from "./portfolioSeo";

/**
 * Runtime SEO head tags. Main portfolio meta lives in public/index.html;
 * this component adds noindex for preview/admin routes and variant-specific titles.
 */
export default function SeoHead({ appMode, previewQuery, portfolioVariant = "results" }) {
  const noIndex = shouldNoIndex({ appMode, previewQuery });
  const seo = getPortfolioSeo(portfolioVariant);

  if (noIndex) {
    return (
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.siteUrl} />
    </Helmet>
  );
}
