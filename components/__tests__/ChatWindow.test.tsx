
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '../ChatWindow';
// Correct import path for lib/api
jest.mock('../../lib/api', () => ({
  getMessages: jest.fn(() => Promise.resolve([])),
  sendMessageToChat: jest.fn(() => Promise.resolve({ assistant: { content: 'Hello!' } })),
}));

describe('ChatWindow', () => {
  it('renders without crashing', () => {
    render(<ChatWindow chatId={null} userId={null} token={null} />);
    // There may be multiple matches for /dragon ai/i, so check at least one exists
    const matches = screen.getAllByText(/dragon ai/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});