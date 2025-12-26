

import React from 'react';
import { render } from '@testing-library/react';
import Sidebar from '../Sidebar';



// Mock Clerk to provide signOut and useAuth with getToken
jest.mock('@clerk/nextjs', () => ({
  useClerk: () => ({ signOut: jest.fn() }),
  useAuth: () => ({ getToken: jest.fn(() => Promise.resolve('mock-token')) })
}));

// Mock getChats and getProfile to return valid data
jest.mock('../../lib/api', () => ({
  getChats: jest.fn(() => Promise.resolve([{ id: '1', createdAt: '2025-12-26T00:00:00Z' }])),
  getProfile: jest.fn(() => Promise.resolve({ name: 'Test User' })),
}));

// Mock window.location.href to prevent navigation during logout
beforeAll(() => {
  // @ts-ignore
  window.location = { href: '' } as any;
});

describe('Sidebar', () => {
  it('renders without crashing and shows user', async () => {
    const { findByText } = render(
      <Sidebar
        chats={[{ id: '1', title: 'Test Chat' }]}
        onNewChat={() => {}}
        onSelectChat={() => {}}
        onRenameChat={() => {}}
        onDeleteChat={() => {}}
        activeChatId={null}
        collapsed={false}
        onToggleSidebar={() => {}}
      />
    );
    // Wait for user name to appear
    expect(await findByText(/Test User/)).toBeInTheDocument();
    // Wait for chat title to appear
    expect(await findByText(/Test Chat/)).toBeInTheDocument();
  });
});