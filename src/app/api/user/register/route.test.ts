import { POST } from './route'; // Update the path
import { expect } from '@jest/globals';
import { register } from '@/lib/dal/auth.dal';

jest.mock('@/lib/dal/auth.dal', () => ({
  register: jest.fn(),
}));

describe('POST /register', () => {
  it('should successfully register a user with valid data', async () => {
    (register as jest.Mock).mockResolvedValue({ succes: true });

    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '12-25-1990',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ succes: true });
  });

  it('should return an error if email is missing', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '12-25-1990',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "field 'email' cannot be empty!" });
  });

  it('should return an error if userName is missing', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        lastName: 'testuser',
        birthDate: '12-25-1990',
        firstName: 'User',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "field 'userName' cannot be empty!" });
  });

  it('should return an error if lastName is missing', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        birthDate: '12-25-1990',
        firstName: 'User',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "field 'lastName' cannot be empty!" });
  });

  it('should return an error if firstName is missing', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        birthDate: '12-25-1990',
        lastName: 'User',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "field 'firstName' cannot be empty!" });
  });

  it('should return an error if birthDate is missing', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "field 'birthDate' cannot be empty!" });
  });

  it('should return an error if birthDate is in an invalid format', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '25-12-1990', // Incorrect format
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      error: "field 'birthDate' must be a valid date in format MM-dd-yyyy!",
    });
  });

  it('should return an error if password is in an invalid format', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '12-25-1990', // Incorrect format
        password: 'password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      error: "field password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and contain a special character!",
    });
  });
  it('should return an error if register fails', async () => {
    (register as jest.Mock).mockResolvedValue({
      succes: false,
      error: 'User already exists',
    });

    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '12-25-1990',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'User already exists' });
  });

  it('should handle unexpected errors gracefully', async () => {
    (register as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const request = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthDate: '12-25-1990',
        password: 'Password!123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Unexpected error' });
  });
});
