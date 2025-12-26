// Jest manual mock for lib/api used in Sidebar
module.exports = {
  getToken: () => Promise.resolve('mock-token'),
  getChats: () => Promise.resolve([]),
  getProfile: () => Promise.resolve({}),
};
