import { useTheme } from 'next-themes';
import { CodeBlock, dracula, monokai, monokaiSublime, hopscotch } from 'react-code-blocks';

const THEME = {
  dark: monokai,
  darken: monokaiSublime,
  light: dracula,
  lighten: hopscotch,
};

function MyCodeBlock({ block }: { block: any }) {
  const { theme } = useTheme();

  return (
    <div className='w-full *:p-4 *:font-thin'>
      <CodeBlock
        language={block.properties?.language?.[0]?.[0]}
        text={block.properties?.title?.[0]?.[0]}
        theme={THEME[(theme as keyof typeof THEME) ?? 'light']}
        showLineNumbers={false}
      />
    </div>
  );
}

export default MyCodeBlock;
