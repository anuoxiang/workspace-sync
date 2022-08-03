import { FileStorage, MockapiStorage } from 'src/common';

describe('Storage', () => {
  const file = new FileStorage();
  const api = new MockapiStorage();
  beforeAll(async () => {});

  it('API To be defined', async () => {
    expect(api).toBeDefined();
  });

  it('File To be defined', async () => {
    expect(file).toBeDefined();
  });

  it(
    'Download a remote profiles',
    async () => {
      const results = await api.findAll(
        'https://62d366beafb0b03fc5b2a55f.mockapi.io/wss/',
      );
      expect(results.length).toBeGreaterThan(0);
    },
    1000 * 60,
  );

  it(
    'API to get single profile',
    async () => {
      const result = await api.findAll(
        'https://62d366beafb0b03fc5b2a55f.mockapi.io/wss/1',
      );
      expect(result).toHaveProperty('repos');
    },
    1000 * 60,
  );
});
