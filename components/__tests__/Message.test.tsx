
import React from 'react';
import { render } from '@testing-library/react';
import Message from '../Message';

describe('Message', () => {
  it('renders user message without crashing', () => {
    render(<Message role="user" content="Hello" />);
  });
  it('renders assistant message without crashing', () => {
    render(<Message role="assistant" content="Hi, how can I help?" />);
  });
});