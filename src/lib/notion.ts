import { MyNotionAPI } from '@/notion-api';
import { NotionAPI } from 'notion-client';

const { Client } = require('@notionhq/client');

// Initializing a client
export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const notionClientAPI = new MyNotionAPI({
  authToken:
    'v02%3Auser_token_or_cookies%3Af2Eqa3EFrEqdpemJBDoy9ez-fO0A8LB5Hvj3Nh6b3eGTZJtVow1A-nnaPwoBubVJLPaXM-E8aX4vDgEcK2uA-GGgolibggXImPaNksLyj1iac5iYB70gUuKO0RX6IRd_MZjH',
  activeUser: '3a99f8ef-df91-4a26-9842-e59d5b9a153c',
});

export const myNotionClient = new MyNotionAPI({
  authToken:
    'v02%3Auser_token_or_cookies%3Af2Eqa3EFrEqdpemJBDoy9ez-fO0A8LB5Hvj3Nh6b3eGTZJtVow1A-nnaPwoBubVJLPaXM-E8aX4vDgEcK2uA-GGgolibggXImPaNksLyj1iac5iYB70gUuKO0RX6IRd_MZjH',
  activeUser: '3a99f8ef-df91-4a26-9842-e59d5b9a153c',
});
