import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  image = "/app-screenshot.png",
  url,
  type = "website",
  noindex = false,
}) => {
  const siteTitle = "Football Shirt Collection";
  const siteUrl = "https://footballshirtcollection.app";
  const defaultDescription = "Track, organize, and showcase your football shirt collection with detailed statistics, wishlist features, and beautiful visualization.";

  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Track Your Kit Collection`;
  const metaDescription = description || defaultDescription;
  const metaImage = image.startsWith("http") ? image : `${siteUrl}${image}`;
  const canonicalUrl = url ? `${siteUrl}${url}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
