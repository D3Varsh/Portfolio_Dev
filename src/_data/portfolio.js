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
    content_type: 'Devarsh',
    order: 'sys.createdAt',
  });

  // Transform the fetched data and add permalink
  return response.items.map(Devarsh => ({
    title: Devarsh.fields.title,
    slug: Devarsh.fields.slug,
    image: Devarsh.fields.image?.fields?.file?.url,
    description: Devarsh.fields.description,
    date: Devarsh.fields.date,
    permalink: `/Devarsh/${Devarsh.fields.slug}/index.html`  // Add permalink to data
  }));
};
