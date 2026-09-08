export interface AboutSectionText {
  text: string;
  href?: string;
  muted?: boolean;
  bold?: boolean;
  italic?: boolean;
}
export interface AboutSection {
  id: string;
  title: string;
  paragraphs: { id: string; parts: AboutSectionText[]; bulleted: boolean }[];
}
interface RichText {
  plain_text?: string;
  text?: { content: string; link?: { url: string } | null };
  href?: string | null;
  annotations?: { color?: string; bold?: boolean; italic?: boolean };
}
export interface AboutBlock {
  id: string;
  type: string;
  archived?: boolean;
  in_trash?: boolean;
  [key: string]: unknown;
}
function safeLink(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, 'https://hunmogu.com');
    if (!['https:', 'http:'].includes(url.protocol)) return undefined;
    return ['hunmogu.com', 'www.hunmogu.com'].includes(url.hostname) ? url.pathname + url.search + url.hash : url.href;
  } catch { return undefined; }
}
export function parseAboutSections(blocks: AboutBlock[]): AboutSection[] {
  const sections: AboutSection[] = [];
  let current: AboutSection | undefined;
  for (const block of blocks) {
    if (block.archived || block.in_trash) continue;
    const content = block[block.type] as { rich_text?: RichText[] } | undefined;
    const richText = content?.rich_text ?? [];
    if (['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
      const title = richText.map(part => part.plain_text ?? part.text?.content ?? '').join('').trim();
      current = ['프로젝트', '수상이력', '자격증'].includes(title) ? { id: block.id, title, paragraphs: [] } : undefined;
      if (current) sections.push(current);
      continue;
    }
    if (!current || !['paragraph', 'bulleted_list_item', 'numbered_list_item'].includes(block.type)) continue;
    const parts = richText.map(part => ({ text: part.plain_text ?? part.text?.content ?? '',
      href: safeLink(part.href ?? part.text?.link?.url), muted: part.annotations?.color === 'gray',
      bold: part.annotations?.bold, italic: part.annotations?.italic }));
    if (parts.some(part => part.text.trim())) current.paragraphs.push({ id: block.id, parts, bulleted: block.type !== 'paragraph' });
  }
  return sections;
}
