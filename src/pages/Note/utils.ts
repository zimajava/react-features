import { Editor, Transforms, Text } from 'slate';

import { CustomNode, CustomEditor } from '../../react-app-env';

export const CustomEditorHelpers = {
  isBoldMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n: CustomNode) => Text.isText(n) && n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, { match: (n: CustomNode) => Text.isText(n) && n.code === true });

    return !!match;
  },

  toggleBoldMark(editor: CustomEditor) {
    const isActive = CustomEditorHelpers.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n: CustomNode) => Text.isText(n), split: true },
    );
  },

  toggleCodeBlock(editor: CustomEditor) {
    const isActive = CustomEditorHelpers.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { code: isActive ? undefined : true },
      { match: (n: CustomNode) => Text.isText(n), split: true },
    );
  },
};
