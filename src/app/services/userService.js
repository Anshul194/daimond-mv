import User from "../models/User.js";
import bcrypt from "bcrypt";
import AppError from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";
import UserRepository from "../repository/userRepository.js";

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserById(id) {
    try {
      console.log("Fetching user with ID:", id);
      return await User.findById(id);
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  }

  async findOrCreateUser(email, userData) {
    try {
      // Check if user exists by email
      let user = await User.findOne({ email });
      if (user) {
        console.log("User found:", user);
        return { userId: user._id, isNewUser: false };
      }
      console.log("User not found, creating new user with email:", email);
      // If user does not exist, create a new user
      // const hashedPassword = await bcrypt.hash(userData.password, 10);
      user = new User({
        ...userData,
        email,
        password: "1234",
      });
      const newUser = await user.save();
      console.log("New user created:", newUser);
      return { userId: newUser._id, isNewUser: true };
    } catch (error) {
      console.error("Error finding or creating user:", error);
      throw new Error("Error finding or creating user: " + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }

  async updateUser(id, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async signup(userData) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      return await user.save();
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  }
  async login(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Return user data (without password)
    const { password: _, ...userData } = user.toObject();
    return userData;
  }

async getAllUsers(query) {
  try {
    console.log("Query Parameters:", query);

    const {
      page = 1,
      limit = 10,
      filters = "{}",
      searchFields = "{}",
      sort = "{}",
    } = query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    console.log("Page Number:", pageNum);
    console.log("Limit Number:", limitNum);
    console.log("Skip:", skip);

    let parsedFilters, parsedSearchFields, parsedSort;
    try {
      parsedFilters = JSON.parse(filters);
      parsedSearchFields = JSON.parse(searchFields);
      parsedSort = JSON.parse(sort);
    } catch (error) {
      console.error("Error parsing query parameters:", error.message);
      throw new AppError(
        "Invalid query parameter format",
        StatusCodes.BAD_REQUEST
      );
    }

    const filterConditions = { deletedAt: null };
    for (const [key, value] of Object.entries(parsedFilters)) {
      filterConditions[key] = value;
    }

    const searchConditions = [];
    for (const [field, term] of Object.entries(parsedSearchFields)) {
      if (term && typeof term === "string") {
        searchConditions.push({ [field]: { $regex: term, $options: "i" } });
      }
    }
    if (searchConditions.length > 0) {
      filterConditions.$or = searchConditions;
    }

    const sortConditions = {};
    for (const [field, direction] of Object.entries(parsedSort)) {
      if (direction === "asc" || direction === "desc") {
        sortConditions[field] = direction === "asc" ? 1 : -1;
      }
    }

    console.log("Filter Conditions:", filterConditions); // Debug log
    const [users, totalCount] = await Promise.all([
      this.userRepo.getALL(filterConditions, sortConditions, skip, limitNum),
      this.userRepo.count(filterConditions),
    ]);

    return {
      users,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalItems: totalCount,
      itemsPerPage: limitNum,
    };
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new AppError(
      "Cannot fetch data of all the users",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
}

export default UserService;
