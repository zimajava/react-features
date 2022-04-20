import React from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import { RenderElementProps, RenderLeafProps } from 'slate-react/dist/components/editable';
import { DefaultElement } from './DefaultElement';
import { Leaf } from './Leaf';
import { CustomEditorHelpers } from './utils';
import { CustomEditor } from '../../react-app-env';

function renderElement(props: RenderElementProps) {
  const { attributes, children } = props;
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (props.element.type) {
    default:
      return <DefaultElement attributes={attributes}>{children}</DefaultElement>;
  }
}

function renderLeaf(props: RenderLeafProps) {
  return <Leaf {...props} />;
}

export default function Note() {
  const editor = React.useMemo<CustomEditor>(() => withHistory(withReact(createEditor())), []);

  const initialValue = React.useMemo<Descendant[]>(() => {
    let value: Descendant[] = [{ type: 'paragraph', children: [{ text: 'A line of text in a paragraph.' }] }];
    const content = localStorage.getItem('content');

    if (content) {
      try {
        value = JSON.parse(content);
      } catch (e) {
        console.error(e);
      }
    }

    return value;
  }, []);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some((op) => op.type !== 'set_selection');

        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem('content', content);
        }
      }}
    >
      <div>
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditorHelpers.toggleBoldMark(editor);
          }}
        >
          Bold
        </button>
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditorHelpers.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case '`': {
              event.preventDefault();
              CustomEditorHelpers.toggleCodeBlock(editor);
              break;
            }
            case 'b': {
              event.preventDefault();
              CustomEditorHelpers.toggleBoldMark(editor);
              break;
            }
            default:
          }
        }}
      />
    </Slate>
  );
}