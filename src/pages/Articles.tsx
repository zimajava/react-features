import React from 'react';
import { createEditor, Descendant, Editor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

type PropsCodeElement = {
  attributes: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLPreElement> & React.HTMLAttributes<HTMLPreElement>;
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
};

function CodeElement(props: PropsCodeElement) {
  const { attributes, children } = props;

  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
}

type PropsDefaultElement = {
  attributes: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLParagraphElement> &
    React.HTMLAttributes<HTMLParagraphElement>;
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
};

function DefaultElement(props: PropsDefaultElement) {
  const { attributes, children } = props;

  return <p {...attributes}>{children}</p>;
}

export default function Articles() {
  const editor = React.useMemo(() => withReact(createEditor()), []);

  const renderElement = React.useCallback((props) => {
    const { attributes, children } = props;
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (props.element.type) {
      case 'code':
        return <CodeElement attributes={attributes}>{children}</CodeElement>;
      default:
        return <DefaultElement attributes={attributes}>{children}</DefaultElement>;
    }
  }, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.key === '`' && event.ctrlKey) {
            // Prevent the "`" from being inserted by default.
            event.preventDefault();
            // Determine whether any of the currently selected blocks are code blocks.
            const [match] = Editor.nodes(editor, { match: (n) => n.type === 'code' });
            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              { type: match ? 'paragraph' : 'code' },
              { match: (n) => Editor.isBlock(editor, n) },
            );
          }
        }}
      />
    </Slate>
  );
}
