require("dotenv").config();
const contentful = require("contentful");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");

module.exports = function (eleventyConfig) {
  // Contentful Configuration using environment variables
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID, // Environment variable for space ID
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN, // Environment variable for access token
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
