import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/gemini-model/route';

describe('POST /api/gemini-model', () => {
  it('returns 400 when userInput is missing', async () => {
    const req = new Request('http://localhost/api/gemini-model', {
      method: 'POST',
      body: JSON.stringify({ userInput: '' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
