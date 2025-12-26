
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImagePreview from '../ImagePreview';

describe('ImagePreview', () => {
  it('renders image with correct src', () => {
    render(<ImagePreview url="/test.png" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.png');
  });
});