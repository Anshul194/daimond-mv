import AdminService from '../services/adminService.js';
import { Token } from '../lib/token.js';
import initRedis from '../config/redis.js';
import { NextResponse } from 'next/server';
import { adminRegisterSchema, adminLoginSchema } from '../validators/adminValidator.js'; // Added 
import { successResponse, errorResponse } from '../utils/response.js';

const adminService = new AdminService();



export async function registerAdmin(data) {
  try {
    const { error, value } = adminRegisterSchema.validate(data);
    if (error) {
      return NextResponse.json(errorResponse('Validation error', 400, error.details), { status: 400 });
    }

    const { email, password, username } = value;

    const existing = await adminService.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(errorResponse('User already exists', 400), { status: 400 });
    }

    const user = await adminService.signup({ email, password, username });
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = Token.generateTokens(user);
    
    const redis = initRedis();
    await redis.set(`accessToken:${accessToken}`, 'valid', 'EX', Math.floor((accessTokenExp - Date.now()) / 1000));
    await redis.set(`refreshToken:${refreshToken}`, user._id.toString(), 'EX', Math.floor((refreshTokenExp - Date.now()) / 1000));

    const { status, body } = successResponse({ user , accessToken, refreshToken, accessTokenExp, refreshTokenExp}, 'User registered', 201);
    const res = NextResponse.json(body, { status });

    Token.setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

    return res;
  } catch (err) {
    console.error('Register error:', err?.message);
    return NextResponse.json(errorResponse('Server error'), { status: 500 });
  }
}


//add api getUserById
export async function getUserById(id) {
  try {
    const user = await adminService.getUserById(id);
    if (!user) {
      return NextResponse.json(errorResponse('User not found', 404), { status: 404 });
    }
    return NextResponse.json(successResponse({ user }, 'User retrieved successfully'));
  } catch (err) {
    console.error('Get user by ID error:', err?.message);
    return NextResponse.json(errorResponse('Server error'), { status: 500 });
  }
}
export async function loginAdmin(data) {
  try {
    const { error, value } = adminLoginSchema.validate(data);
    if (error) {
      return NextResponse.json(errorResponse('Validation error', 400, error.details), { status: 400 });
    }

    const { email, password } = value;

    const user = await adminService.validateCredentials(email, password);
    if (!user) {
      return NextResponse.json(errorResponse('Invalid email or password', 401), { status: 401 });
    }

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = Token.generateTokens(user);
    
    const redis = initRedis();
    await redis.set(`accessToken:${accessToken}`, 'valid', 'EX', Math.floor((accessTokenExp - Date.now()) / 1000));
    await redis.set(`refreshToken:${refreshToken}`, user._id.toString(), 'EX', Math.floor((refreshTokenExp - Date.now()) / 1000));

    const { status, body } = successResponse(
      { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp },
      'User logged in',
      200
    );
    const res = NextResponse.json(body, { status });

    Token.setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

    return res;
  } catch (err) {
    console.error('Login error:', err?.message);
    return NextResponse.json(errorResponse('Server error'), { status: 500 });
  }
}
