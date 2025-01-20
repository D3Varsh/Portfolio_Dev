const contentful = require('contentful');
require('dotenv').config();


// Initialize Contentful client
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

module.exports = async () => {
  // Fetch player data from Contentful
  const response = await client.getEntries({
    content_type: 'devarsh',
    order: 'sys.createdAt',
  });

  // Transform the fetched data and add permalink
  return response.items.map(devarsh => ({
    title: devarsh.fields.title,
    image: devarsh.fields.image?.fields?.file?.url,
    slug: devarsh.fields.slug,
    content: devarsh.fields.content,
    date: devarsh.fields.date,
    permalink: `/devarsh/${devarsh.fields.slug}/index.html`  // Add permalink to data
  }));
};
