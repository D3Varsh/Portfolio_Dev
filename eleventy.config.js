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

  // Fetch the Devarsh entries from Contentful
  eleventyConfig.addCollection("devarsh", async function () {
    try {
      const response = await client.getEntries({
        content_type: "devarsh",
      });

      console.log("Content fetched from Contentful:", response.items); // Debug log

      return response.items.map((item) => {
        console.log("Content field structure:", item.fields.content); // Debug the content structure

        const htmlContent = documentToHtmlString(item.fields.content); // Render rich text content
        console.log("Rendered HTML:", htmlContent); // Log the final HTML

        return {
          title: item.fields.title,
          image: item.fields.image ? item.fields.image.fields.file.url : null,
          slug: item.fields.slug,
          content: htmlContent,
          date: item.fields.date,
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
