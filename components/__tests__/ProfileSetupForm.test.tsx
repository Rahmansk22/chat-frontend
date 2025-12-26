
import React from 'react';
import { render } from '@testing-library/react';
import ProfileSetupForm from '../ProfileSetupForm';

describe('ProfileSetupForm', () => {
  it('renders without crashing', () => {
    render(<ProfileSetupForm />);
  });
});