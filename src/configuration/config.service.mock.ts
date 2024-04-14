const JWT_ACCESS_SECRET = 'test';
const JWT_ACCESS_EXPIRES_IN = 1;
const JWT_REFRESH_SECRET = 'test_refresh';
const JWT_REFRESH_EXPIRES_IN = 7;

export const ConfigServiceMock = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_ACCESS_SECRET') return JWT_ACCESS_SECRET;
    if (key === 'JWT_ACCESS_EXPIRES_IN') return JWT_ACCESS_EXPIRES_IN;
    if (key === 'JWT_REFRESH_SECRET') return JWT_REFRESH_SECRET;
    if (key === 'JWT_REFRESH_EXPIRES_IN') return JWT_REFRESH_EXPIRES_IN;

    return null;
  }),
};
