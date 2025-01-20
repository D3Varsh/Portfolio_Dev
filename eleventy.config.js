require("dotenv").config();
const contentful = require("contentful");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");

module.exports = function (eleventyConfig) {
  // Check if environment variables are properly set
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    throw new Error('Missing Contentful space ID or access token in environment variables.');
  }

  // Contentful Configuration
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  // Fetch the player data from Contentful
  eleventyConfig.addCollection("devarsh", async function () {
    try {
      const response = await client.getEntries({
        content_type: "devarsh",
      });

      return response.items.map((item) => {
        return {
          title: item.fields.title,
          image: item.fields.image ? item.fields.image.fields.file.url : null,
          slug: item.fields.slug,
          content: documentToHtmlString(item.fields.content),
          date: item.fields.date,
          permalink: `/devarsh/${devarsh.fields.slug}/index.html`
        };
      });
    } catch (error) {
      console.error("Error fetching data from Contentful:", error);
      return [];
    }
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
