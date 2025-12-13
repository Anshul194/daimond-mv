import UserService from "../services/userService.js";
import { Token } from "../lib/token.js";
import initRedis from "../config/redis.js";
import { NextResponse } from "next/server";
import {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../validators/userValidator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateImageFile, saveFile, deleteFile } from "../lib/fileUpload.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const userService = new UserService();

async function sendOTPByEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // Temporary workaround: bypass certificate verification
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// In userController.js
export async function sendOTP(data) {
  try {
    const { email } = data;
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ success: false, message: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const otp = generateOTP();
    const redis = initRedis();
    await redis.set(`otp:${email}`, otp, "EX", 600); // Stores OTP in Redis with 10-minute expiry

    await sendOTPByEmail(email, otp);

    return new Response(
      JSON.stringify({
        success: true,
        otp,
        message: "OTP sent successfully",
        email,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Send OTP error:", err.message);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send OTP" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function registerUser(data) {
  try {
    // Validate request
    const { error, value } = userRegisterSchema.validate(data);
    if (error) {
      return NextResponse.json(
        errorResponse("Validation error", 400, error.details),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await userService.getUserByEmail(value.email);
    if (existing) {
      return NextResponse.json(errorResponse("User already exists", 400), {
        status: 400,
      });
    }

    // Create user
    const user = await userService.signup(value);

    // Generate tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      Token.generateTokens(user);
    console.log("Generated Tokens:", {
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp,
    });

    // Store in Redis
    const redis = initRedis();
    await redis.set(
      `accessToken:${accessToken}`,
      "valid",
      "EX",
      Math.floor((accessTokenExp - Date.now()) / 1000)
    );
    await redis.set(
      `refreshToken:${refreshToken}`,
      user._id.toString(),
      "EX",
      Math.floor((refreshTokenExp - Date.now()) / 1000)
    );

    // Build response
    const { status, body } = successResponse({ user }, "User registered", 201);
    const res = NextResponse.json(body, { status });

    // ✅ Set cookies
    Token.setTokensCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    return res;
  } catch (err) {
    console.error("Register error:", err?.message);
    return NextResponse.json(errorResponse("Server error"), { status: 500 });
  }
}

export async function updateUser(data) {
  try {
    const { userId, profilepic, ...updateFields } = data;

    // Get existing user
    const existingUser = await userService.getUserById(userId);
    if (!existingUser) {
      return NextResponse.json(errorResponse("User not found", 404), {
        status: 404,
      });
    }

    let profilePicUrl = existingUser.profilepic;

    // Handle profile picture update if provided
    if (profilepic && profilepic instanceof File) {
      try {
        console.log("Processing new profile picture:", profilepic.name);
        validateImageFile(profilepic);

        // Delete old profile picture if exists
        if (existingUser.profilepic) {
          await deleteFile(existingUser.profilepic);
        }

        // Save new profile picture
        profilePicUrl = await saveFile(profilepic, "profile-pics");
        console.log("New profile picture saved at:", profilePicUrl);
      } catch (fileError) {
        console.error("File upload error:", fileError);
        return NextResponse.json(
          errorResponse("File upload error: " + fileError.message, 400),
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateFields,
      profilepic: profilePicUrl,
    };

    // Hash password if provided
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    // Validate update data
    const { error, value } = userUpdateSchema.validate(dataToUpdate);
    if (error) {
      console.error("Validation error:", error.details);
      return NextResponse.json(
        errorResponse("Validation error", 400, error.details),
        { status: 400 }
      );
    }

    // Check email uniqueness if email is being updated
    if (value.email && value.email !== existingUser.email) {
      const emailExists = await userService.getUserByEmail(value.email);
      if (emailExists) {
        return NextResponse.json(errorResponse("Email already exists", 400), {
          status: 400,
        });
      }
    }

    // Update user
    const updatedUser = await userService.updateUser(userId, value);
    console.log("User updated successfully:", updatedUser.email);

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser._doc;

    const { status, body } = successResponse(
      { user: userWithoutPassword },
      "User updated successfully",
      200
    );

    return NextResponse.json(body, { status });
  } catch (err) {
    console.error("User Update Error:", err);
    return NextResponse.json(errorResponse("Server error: " + err.message), {
      status: 500,
    });
  }
}
export async function loginUser(data) {
  try {
    // Validate input
    const { error, value } = userLoginSchema.validate(data);
    if (error) {
      return NextResponse.json(
        errorResponse("Validation error", 400, error.details),
        { status: 400 }
      );
    }

    // Login user (throws error if invalid)
    const user = await userService.login(value.email, value.password);

    // Generate tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      Token.generateTokens(user);

    // Store tokens in Redis
    const redis = initRedis();
    await redis.set(
      `accessToken:${accessToken}`,
      "valid",
      "EX",
      Math.floor((accessTokenExp - Date.now()) / 1000)
    );
    await redis.set(
      `refreshToken:${refreshToken}`,
      user._id.toString(),
      "EX",
      Math.floor((refreshTokenExp - Date.now()) / 1000)
    );

    // Build response
    const { status, body } = successResponse(
      { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp },
      "Login successful",
      200
    );
    const res = NextResponse.json(body, { status });

    // Set cookies with tokens
    Token.setTokensCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    return res;
  } catch (err) {
    console.error("Login error:", err.message);
    return NextResponse.json(errorResponse(err.message || "Server error"), {
      status: 401,
    });
  }
}

export async function verifyOTP(data) {
  try {
    const { email, otp } = data;

    // Manual validation (similar to sendOTP)
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ success: false, message: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (
      !otp ||
      typeof otp !== "string" ||
      otp.length !== 6 ||
      !/^\d+$/.test(otp)
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Valid 6-digit OTP is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check OTP in Redis
    const redis = initRedis();
    const storedOTP = await redis.get(`otp:${email}`);
    if (!storedOTP) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP expired or not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (storedOTP !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch user
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      Token.generateTokens(user);

    // Store tokens in Redis
    await redis.set(
      `accessToken:${accessToken}`,
      "valid",
      "EX",
      Math.floor((accessTokenExp - Date.now()) / 1000)
    );
    await redis.set(
      `refreshToken:${refreshToken}`,
      user._id.toString(),
      "EX",
      Math.floor((refreshTokenExp - Date.now()) / 1000)
    );

    // Delete OTP from Redis after successful verification
    await redis.del(`otp:${email}`);
    console.log(`OTP for ${email} deleted from Redis`);

    // Build response (using successResponse for consistency with loginUser)
    const { status, body } = successResponse(
      { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp },
      "OTP verified successfully",
      200
    );
    const res = NextResponse.json(body, { status });

    // Set cookies with tokens
    Token.setTokensCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    return res;
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message || "Server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getUserProfile(token) {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decoded);
    if (!decoded || !decoded.userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check token in Redis
    const redis = initRedis();
    const tokenStatus = await redis.get(`accessToken:${token}`);
    if (!tokenStatus) {
      return new Response(
        JSON.stringify({ success: false, message: "Token revoked or expired" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch user
    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Remove sensitive fields
    const { password, ...userWithoutPassword } = user._doc || user.toObject();

    // Build response
    const { status, body } = successResponse(
      { user: userWithoutPassword },
      "User profile fetched successfully",
      200
    );
    return NextResponse.json(body, { status });
  } catch (err) {
    console.error("Get User Profile Error:", err.message);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function logoutUser(token) {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decoded);
    if (!decoded || !decoded.userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Remove tokens from Redis
    const redis = initRedis();
    await redis.del(`accessToken:${token}`);
    await redis.del(`refreshToken:${token}`);
    console.log(`Tokens for user ${decoded.userId} removed from Redis`);

    // Build response
    const { status, body } = successResponse(
      {},
      "Logged out successfully",
      200
    );
    const res = NextResponse.json(body, { status });

    // Clear token cookies
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err) {
    console.error("Logout Error:", err.message);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getUsers(query) {
  try {
    console.log("Get Users query:", query);
    const { users, currentPage, totalPages, totalItems, itemsPerPage } = await userService.getAllUsers(query);

    return {
      status: 200,
      body: {
        status: "success",
        message: "Users fetched successfully",
        data: {
          users,
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage, // Directly include pagination fields
        },
      },
    };
  } catch (err) {
    console.error("Get Users error:", err.message);
    return {
      status: err.statusCode || 500,
      body: {
        status: "error",
        message: err.message || "Server error",
        errorCode: err.statusCode || 500,
      },
    };
  }
}
