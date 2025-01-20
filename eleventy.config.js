module.exports = function(eleventyConfig) {


    // Passthrough for CSS and image files
    eleventyConfig.addPassthroughCopy("./src/css");
    eleventyConfig.addPassthroughCopy("./src/img");

eleventyConfig.addPassthroughCopy("src/_includes/css");

// Default Eleventy Configuration
return {
  dir: {
    input: "src", // Input directory
    output: "dist", // Output directory
  },
};
};