// Manual mock for react-markdown to bypass ESM transform issues in Jest
import React from 'react';
export default function ReactMarkdown(props) {
  return <div>{props.children}</div>;
}