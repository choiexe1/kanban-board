const JWT_ACCESS_SECRET = 'test';
const JWT_ACCESS_EXPIRES_IN = 1;

export const ConfigServiceMock = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_ACCESS_SECRET') return JWT_ACCESS_SECRET;
    if (key === 'JWT_ACCESS_EXPIRES_IN') return JWT_ACCESS_EXPIRES_IN;

    return null;
  }),
};
