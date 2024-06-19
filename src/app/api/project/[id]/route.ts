// @ts-nocheck
import { notionClient } from '@/lib/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const page: any = await notionClient.pages.retrieve({
    auth: process.env.NOTION_API_KEY,
    page_id: id,
  });

  // const comments = await notionClient.comments.list({
  //   auth: process.env.NOTION_API_KEY,
  //   block_id: id,
  // });

  const pageInfo = {
    id: page.id,
    cover: page.cover?.file?.url,
    createdAt: page.properties?.createdAt?.created_time,
    start: page.properties?.date?.date?.start,
    end: page.properties?.date?.date?.end,
    icon: page.icon,
    type: page.properties?.type?.select?.name,
    status: page.properties?.status?.select?.name,
    title: page.properties?.name?.title?.[0]?.plain_text,
    overview: page.properties?.overview?.rich_text?.[0]?.plain_text,
    skills: page.properties?.skills?.multi_select?.map((skill: any) => skill.name),
  };

  const data = await getChildrenNodes(id);

  // res.send({ comments, pageInfo: pageInfo, child: returnArr });
  return NextResponse.json({ data });
}

async function getChildrenNodes(id) {
  const blockChild = await notionClient.blocks.children.list({
    block_id: id,
    auth: process.env.NOTION_API_KEY,
  });

  const data = blockChild.results
    .map((result) => {
      let type = result.type;
      let payload = result[result.type];
      let link = null;
      if (type === 'divider') {
        payload = 'divider';
      }
      if (payload.rich_text) {
        if (payload?.rich_text?.length > 0) {
          link = payload.rich_text[0].href;
          payload = payload.rich_text.reduce((acc, value) => acc + value.plain_text, '');
        } else {
          type = 'blank';
          payload = '';
        }
      }
      if (!result.has_children) return { id: result.id, type, payload, link, has_children: result.has_children };
      else return { id: result.id, type, payload, link, has_children: result.has_children };
    })
    .filter((item) => item !== undefined);

  return data;
}
