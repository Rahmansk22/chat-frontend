
import React from 'react';
import { render } from '@testing-library/react';
import PromptBox from '../PromptBox';

describe('PromptBox', () => {
  it('renders without crashing', () => {
    render(<PromptBox />);
  });
});