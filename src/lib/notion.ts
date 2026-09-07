import { MyNotionAPI } from '@/notion-api';

const { Client } = require('@notionhq/client');

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Published pages can be read without a browser session cookie.
export const myNotionClient = new MyNotionAPI({
  authToken: process.env.NOTION_AUTH_TOKEN,
  activeUser: process.env.NOTION_ACTIVE_USER,
});

export const notionClientAPI = myNotionClient;
