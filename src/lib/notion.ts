const { Client } = require('@notionhq/client');

// Initializing a client
export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});
