import supertest from 'supertest';
import { app } from './index.js';

describe('GET /book/allbooks', () => {
  it('should return a list of books', async () => {
    const response = await supertest(app).get('/book/allbooks');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('All Books fetched successfully'); 
    expect(Array.isArray(response.body.books)).toBe(true); // Ensure the books property is an array
    expect(response.body.books.length).toBeGreaterThan(0); // Ensure there are books in the array
  });
});
