require("dotenv").config();
const contentful = require("contentful");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");

module.exports = function (eleventyConfig) {
  // Contentful Configuration
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID, // Using environment variable for security
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN, // Using environment variable for security
  });

  // Fetch the player data from Contentful
  eleventyConfig.addCollection("devarsh", async function () {
    try {
      const response = await client.getEntries({
        content_type: "devarsh", // The content type in Contentful
      });


      return response.items.map((item) => {
        return {
          title: item.fields.title,
          image: item.fields.image ? item.fields.image.fields.file.url : null,
          slug: item.fields.slug,
          content: documentToHtmlString(item.fields.content), 
          date: item.fields.date,
          url: `/devarsh/${item.fields.slug}/`, 
        };
      });
    } catch (error) {
      console.error("Error fetching player data from Contentful:", error);
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
