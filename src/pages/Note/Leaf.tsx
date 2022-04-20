import React from 'react';

import { CustomText } from '../../react-app-env';

type Props = {
  attributes: JSX.IntrinsicAttributes & React.ClassAttributes<any> & React.HTMLAttributes<any>;
  leaf: CustomText;
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
};

export function Leaf(props: Props) {
  const { attributes, children, leaf } = props;

  let element = children;

  if (leaf.code) {
    element = <code>{children}</code>;
  }

  return (
    <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}>
      {element}
    </span>
  );
}
