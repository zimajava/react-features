import React from 'react';

type Props = {
  attributes: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLParagraphElement> &
    React.HTMLAttributes<HTMLParagraphElement>;
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
};

export function DefaultElement(props: Props) {
  const { attributes, children } = props;

  return <p {...attributes}>{children}</p>;
}
