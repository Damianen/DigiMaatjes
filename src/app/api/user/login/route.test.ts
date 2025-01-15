// filepath: /C:/Users/Coen/Documents/Avans/Jaar 2/Periode 2/DigiMaatjes/src/app/api/user/login/route.test.ts
/**
 * @jest-environment node
 */

import { POST } from "./route";
import { login } from "@/lib/dal/auth.dal";
import { createSession } from "@/lib/session";
import{expect} from '@jest/globals';

jest.mock('@/lib/dal/auth.dal', () => ({
    login: jest.fn(),
  }));
  jest.mock('@/lib/session', () => ({
    createSession: jest.fn(),
  }));

describe('POST /api/user/login', () => {
    it('should return a token when the user logs in successfully', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ userName: 'testuser', password: 'testpassword' })
        } as unknown as Request;

        (login as jest.Mock).mockResolvedValue({ succes: true });
        (createSession as jest.Mock).mockResolvedValue('mockToken');

        const response = await POST(mockRequest);
        const jsonResponse = await response.json();

        expect(response.status).toBe(200);
        expect(jsonResponse).toEqual({ succes: true, token: 'mockToken' });
    });

    it('should return an error if userName is missing', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ password: 'testpassword' })
        } as unknown as Request;

        const response = await POST(mockRequest);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ error: "field 'userName' cannot be empty!" });
    });

    it('should return an error if password is missing', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ userName: 'testuser' })
        } as unknown as Request;

        const response = await POST(mockRequest);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ error: "field 'password' cannot be empty!" });
    });

    it('should return an error if login fails', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ userName: 'testuser', password: 'testpassword' })
        } as unknown as Request;

        (login as jest.Mock).mockResolvedValue({ succes: false, error: 'Invalid credentials' });

        const response = await POST(mockRequest);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ error: 'Invalid credentials' });
    });

    it('should return an error if an unexpected error occurs', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Unexpected error'))
        } as unknown as Request;

        const response = await POST(mockRequest);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ error: 'Unexpected error' });
    });
});