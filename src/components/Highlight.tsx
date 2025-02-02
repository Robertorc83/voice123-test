import { FC } from 'react';

interface HighlightProps {
  text: string;
  query: string;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const Highlight: FC<HighlightProps> = ({ text, query }) => {
  if (!query) return <span>{text}</span>;

  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.match(regex) ? (
          <mark key={index} style={{ backgroundColor: 'yellow' }}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default Highlight;
