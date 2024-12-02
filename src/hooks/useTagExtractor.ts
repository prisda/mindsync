import { useEffect, useState } from 'react';

export function useTagExtractor(content: string) {
  const [extractedTags, setExtractedTags] = useState<string[]>([]);

  useEffect(() => {
    const tagRegex = /#[\w\u0590-\u05ff]+/g;
    const matches = content.match(tagRegex) || [];
    const uniqueTags = [...new Set(matches)];
    setExtractedTags(uniqueTags);
  }, [content]);

  return extractedTags;
}