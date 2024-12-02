import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

export async function convertToDocx(markdown: string): Promise<void> {
  const tokens = marked.lexer(markdown);
  const docChildren: Paragraph[] = [];

  function processTokens(tokens: marked.Token[]): void {
    tokens.forEach(token => {
      switch (token.type) {
        case 'heading':
          docChildren.push(new Paragraph({
            text: token.text,
            heading: `Heading${token.depth}` as HeadingLevel,
            spacing: { before: 200, after: 200 },
          }));
          break;

        case 'paragraph':
          docChildren.push(new Paragraph({
            children: [new TextRun({ text: token.text })],
            spacing: { before: 120, after: 120 },
          }));
          break;

        case 'list':
          token.items.forEach((item, index) => {
            docChildren.push(new Paragraph({
              children: [new TextRun({ text: `${token.ordered ? `${index + 1}.` : '•'} ${item.text}` })],
              spacing: { before: 60, after: 60 },
              indent: { left: 720 },
            }));
          });
          break;

        case 'code':
          docChildren.push(new Paragraph({
            children: [new TextRun({
              text: token.text,
              font: 'Consolas',
              size: 20,
            })],
            spacing: { before: 120, after: 120 },
            indent: { left: 720 },
          }));
          break;

        case 'blockquote':
          if ('tokens' in token) {
            processTokens(token.tokens);
          }
          break;

        case 'table':
          // Add table support if needed
          break;
      }
    });
  }

  processTokens(tokens);

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'document.docx');
}