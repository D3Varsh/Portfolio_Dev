require("dotenv").config();
const contentful = require("contentful");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");

module.exports = function (eleventyConfig) {
  // Contentful Configuration
  const client = contentful.createClient({
    space:"a70tz55cwe4z",
    accessToken:"rG-jHN-q08huMOALYi4l8GcyW5IAo1noLoW__3qAL3U",
  });

  // Fetch the player data from Contentful
  eleventyConfig.addCollection("Devarsh", async function () {
    const response = await client.getEntries({
      content_type: "Devarsh",
    });

    return response.items.map((item) => {
      return {
        title: item.fields.title,
        slug: item.fields.slug,
        image: item.fields.image ? item.fields.image.fields.file.url : null,
        description: documentToHtmlString(item.fields.description),
        date: item.fields.date
      };
    });
  });

  // Passthrough for static assets (like CSS)
  eleventyConfig.addPassthroughCopy("src/_includes/css");

  // Default Eleventy Configuration
  return {
    dir: {
      input: "src", // Input directory
      output: "dist", // Output directory
    },
  };
};
