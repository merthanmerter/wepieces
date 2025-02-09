import { Helmet as ReactHelmet } from "react-helmet-async";
type Meta = {
  title?: string;
  description?: string;
  keywords?: string;
  ["og:title"]?: string;
  ["og:description"]?: string;
  ["og:type"]?: string;
  ["og:image"]?: string;
  ["og:url"]?: string;
  ["twitter:title"]?: string;
  ["twitter:description"]?: string;
  ["twitter:image"]?: string;
  ["twitter:card"]?: string;
};

const Helmet = ({ meta }: { meta?: Meta }) => {
  const appName = "Wepieces";
  const defaultDescription = "Default app description.";
  const defaultImage = "https://extrusionsim.com/default-image.jpg";
  const defaultUrl = "https://extrusionsim.com";

  const title = meta?.title ? `${appName} - ${meta.title}` : appName;

  return (
    <ReactHelmet>
      {/* Title */}
      <title>{title}</title>

      {/* SEO Meta Tags */}
      <meta
        name='description'
        content={meta?.description || defaultDescription}
      />
      {meta?.keywords && (
        <meta
          name='keywords'
          content={meta?.keywords}
        />
      )}

      {/* Open Graph Meta Tags */}
      <meta
        property='og:title'
        content={meta?.["og:title"] || `${appName} - ${meta?.title}`}
      />
      <meta
        property='og:description'
        content={
          meta?.["og:description"] || meta?.description || defaultDescription
        }
      />
      <meta
        property='og:type'
        content={meta?.["og:type"] || "website"}
      />
      <meta
        property='og:image'
        content={meta?.["og:image"] || defaultImage}
      />
      <meta
        property='og:url'
        content={meta?.["og:url"] || defaultUrl}
      />

      {/* Twitter Meta Tags */}
      <meta
        name='twitter:title'
        content={meta?.["twitter:title"] || `${appName} - ${meta?.title}`}
      />
      <meta
        name='twitter:description'
        content={
          meta?.["twitter:description"] ||
          meta?.description ||
          defaultDescription
        }
      />
      <meta
        name='twitter:image'
        content={meta?.["twitter:image"] || defaultImage}
      />
      <meta
        name='twitter:card'
        content={meta?.["twitter:card"] || "summary_large_image"}
      />

      {/* Generic Meta Tags */}
      {meta &&
        Object.entries(meta).map(([key, value]) => {
          // Skip any tags already handled
          if (
            [
              "title",
              "description",
              "keywords",
              "og:title",
              "og:description",
              "og:type",
              "og:image",
              "og:url",
              "twitter:title",
              "twitter:description",
              "twitter:image",
              "twitter:card",
            ].includes(key)
          ) {
            return null;
          }
          return (
            <meta
              key={key}
              name={key}
              content={value}
            />
          );
        })}
    </ReactHelmet>
  );
};

export default Helmet;
