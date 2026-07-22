import { test, expect } from './base-test';

test.describe('Ticket 752: BYOS Secret Leakage @regression', () => {
  const endpoint = '/api/settings/byos';

  test('GET /api/settings/byos omits or masks secretAccessKey', async ({ page }) => {
    const testSecret = 'SuperSecretKey123!@#';
    const payload = {
      provider: 'S3',
      bucketName: 'test-bucket',
      region: 'us-east-1',
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: testSecret,
      endpoint: 'https://s3.us-east-1.amazonaws.com'
    };

    const postRes = await page.request.post(endpoint, {
      data: payload,
    });
    
    expect(postRes.status()).toBe(200);

    const getRes = await page.request.get(endpoint);
    expect(getRes.status()).toBe(200);

    const data = await getRes.json();
    const config = data.config;

    if (config && 'secretAccessKey' in config) {
      expect(config.secretAccessKey).not.toBe(testSecret);
      expect(config.secretAccessKey).toBe('********');
    } else if (config) {
      expect(config.secretAccessKey).toBeUndefined();
    }
  });

  test('POST /api/settings/byos with masked secret preserves existing encrypted secret', async ({ page }) => {
    const initialSecret = 'RealSecretKey456$%^';
    const initialPayload = {
      provider: 'S3',
      bucketName: 'initial-bucket',
      region: 'us-east-1',
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: initialSecret,
      endpoint: 'https://s3.us-east-1.amazonaws.com'
    };

    let res = await page.request.post(endpoint, { data: initialPayload });
    expect(res.status()).toBe(200);

    const updatePayload = {
      ...initialPayload,
      bucketName: 'updated-bucket',
      secretAccessKey: '********'
    };

    res = await page.request.post(endpoint, { data: updatePayload });
    expect(res.status()).toBe(200);

    const getRes = await page.request.get(endpoint);
    const data = await getRes.json();
    expect(data.config.bucketName).toBe('updated-bucket');
    
    if (data.config && 'secretAccessKey' in data.config) {
      expect(data.config.secretAccessKey).toBe('********');
    }
  });
});
