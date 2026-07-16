import { Helmet } from "react-helmet";
import { PORTFOLIO_SEO, shouldNoIndex } from "./portfolioSeo";

/**
 * Runtime SEO head tags. Main portfolio meta lives in public/index.html;
 * this component adds noindex for preview/admin routes.
 */
export default function SeoHead({ appMode, previewQuery }) {
  const noIndex = shouldNoIndex({ appMode, previewQuery });

  if (noIndex) {
    return (
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{PORTFOLIO_SEO.title}</title>
      <meta name="description" content={PORTFOLIO_SEO.description} />
      <link rel="canonical" href={PORTFOLIO_SEO.siteUrl} />
    </Helmet>
  );
}
