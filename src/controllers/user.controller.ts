// import {
//   Controller,
//   Route,
//   Post,
//   Body,
//   Get,
//   Path,
//   Queries,
//   // Request,
//   // Middlewares,
//   Delete,
//   Put,
// } from "tsoa";

// import { UserModel, User } from "@/src/database/models/user.models";
// // import { Request as ExpressRequest } from "express";
// import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken"
// import validator = require("validator");

// import {
//   NotFoundError,
//   ValidationError,
// } from "@/src/utils/errors/customErrors";
// // import { ReasonPhrases } from "@/src/utils/constands/statusCodes";
// // import { authorizeUser, authorizeRoles } from '../middlewares/authRequire';
// // import path = require("path");

// interface UserQueryParams {
//   page?: string;
//   limit?: string;
//   // Add more query parameters as needed
// }
// @Route("api/v1/users")
// export class UsersController extends Controller {
//   // private userService: UserService = new UserService();
//   constructor() {
//     super();
//   }

//   //* get all user
//   @Get()
//   // @Middlewares([authorizeUser, authorizeRoles("admin")])
//   async getAllUser(
//     @Queries() query: UserQueryParams = { page: "1", limit: "10" }
//   ): Promise<any> {
//     try {
//       const options = {
//         page: parseInt(query.page?.toString() || "1"),
//         limit: parseInt(query.limit?.toString() || "10"),
//       };
//       // count document;
//       console.log(options.limit);
//       const totalUser = await UserModel.countDocuments();
//       const totalPages = Math.ceil(totalUser / options.limit);
//       console.log(totalPages);
//       const users = await UserModel.find()
//         .skip((options.page - 1) * options.limit)
//         .limit(options.limit);

//       return { users, totalUser, totalPages, page: options.page };
//     } catch (error: any) {
//       // Handle specific known errors
//       if (error instanceof ValidationError || error instanceof NotFoundError) {
//         throw error;
//       }
//       // Handle unknown errors
//       console.error("Unexpected Error:", error);
//       throw new Error();
//       // `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
//     }
//   }

//   //* get one
//   @Get("{id}")
//   // @Middlewares(authorizeUser)
//   public async getUser(@Path() id: string): Promise<User | null> {
//     try {
//       // Retrieve the user with the given ID from the database
//       const user = await UserModel.findById(id).exec();
//       // Return the user if found, otherwise return null
//       return user;
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       throw error;
//     }
//   }

//   //* update user;
//   @Put("{id}")
//   // @Middlewares([authorizeUser, authorizeRoles("admin")])
//   public async updateUser(
//     @Path() id: string,
//     @Body()
//     requestBody: {
//       fullName?: string;
//       email?: string;
//       password?: string;
//       status?: string;
//     }
//   ): Promise<any> {
//     try {
//       // Find the user by ID
//       const user = await UserModel.findById(id);
//       if (!user) {
//         return {
//           status: 404,
//           message: "User not found",
//         };
//       }

//       // Update user fields
//       if (requestBody.fullName) {
//         user.fullName = requestBody.fullName;
//       }
//       if (requestBody.email) {
//         user.email = requestBody.email;
//       }
//       if (requestBody.password) {
//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(requestBody.password, 10);
//         user.password = hashedPassword;
//       }
//       if (requestBody.status) {
//         user.status = requestBody.status;
//       }

//       // Save the updated user back to the database
//       const updatedUser = await user.save();
//       return {
//         status: 200,
//         message: "User updated successfully",
//         data: updatedUser,
//       };
//     } catch (error) {
//       return {
//         status: 500,
//         message: "Internal server error",
//         error: error,
//       };
//     }
//   }

//   //* delete user
//   @Delete("{id}")
//   public async deleteUser(@Path() id: string): Promise<any> {
//     try {
//       const user = await UserModel.findById(id);
//       if (!user) {
//         return {
//           status: 404,
//           message: " User not found ",
//         };
//       }
//       // Delete the user
//       await UserModel.findByIdAndDelete(id);

//       // Return a success response
//       return {
//         status: 200,
//         message: "Delete successfully",
//       };
//     } catch (err) {
//       throw err;
//     }
//   }

//   //* register new user
//   @Post("register")
//   public async createUser(
//     @Body() requestBody: { username: string; email: string; password: string }
//     // @Request() request: any
//   ): Promise<any> {
//     try {
//       // Validate password strength
//       if (
//         !validator.isStrongPassword(requestBody.password, {
//           minLength: 8,
//           minLowercase: 1,
//           minUppercase: 1,
//           minNumbers: 1,
//           minSymbols: 1,
//         })
//       ) {
//         throw new ValidationError("Password is not strong enough");
//       }

//       // Hash the password using bcrypt
//       const hashedPassword = await bcrypt.hash(requestBody.password, 10);

//       // Create a new user document using the request body
//       const newUser = new UserModel({
//         username: requestBody.username,
//         email: requestBody.email,
//         password: hashedPassword, // Save the hashed password
//       });

//       // Save the new user to the database
//       const savedUser = await newUser.save();

//       // Return the saved user
//       return savedUser;
//     } catch (error: any) {
//       // Handle specific known errors
//       if (error instanceof ValidationError || error instanceof NotFoundError) {
//         throw error;
//       }

//       // Handle unknown errors
//       console.error("Unexpected Error:", error);
//       throw new Error();
//       // `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
//     }
//   }

//   //   @Post("login")
//   //   public async login(
//   //     @Body() requestBody: { email: string; password: string },
//   //     @Request() request: ExpressRequest
//   //   ): Promise<any> {
//   //     const response = request.res!;

//   //     try {
//   //       const { email, password } = requestBody;
//   //       console.log(password);
//   //       // Find user by email
//   //       const findUser = await UserModel.findOne({ email });
//   //       if (!findUser) {
//   //         response.status(404).json({ error: "User not found" });
//   //         return;
//   //       }

//   //       // Validate password
//   //       const isPasswordMatch = await bcrypt.compare(password, findUser.password);
//   //       if (!isPasswordMatch) {
//   //         response.status(401).json({ error: 'Invalid password' });
//   //         return;
//   //       }

//   //       // Generate JWT token
//   //       // const token = jwt.sign(
//   //       //   { _id: findUser._id, email: findUser.email },
//   //       //   process.env.SECRET!,
//   //       //   { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
//   //       // );

//   //   //     // Set cookie with the JWT token
//   //   //     response.cookie("token", token, {
//   //   //       // httpOnly: true,
//   //   //       // secure: true, // Enable in production (requires HTTPS)
//   //   //       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//   //   //       httpOnly: true,
//   //   //       secure: true, // Make sure to set this for HTTPS
//   //   //       path: "/",
//   //   //       // sameSite: "None", // Recommended for added security
//   //   //     });

//   //   //     response.json({ message: "Login successful", token });
//   //   //   } catch (error) {
//   //   //     throw error;
//   //   //     // response.status(500).json({ error: 'Internal server error' });
//   //   //   }
//   //   // }
//   // }

//   // @Get()
//   // @Middlewares(authorizeUser)
//   // // @Middlewares([authorizeUser, authorizeRoles('admin')])
//   // async getAllUser(
//   //   // @Queries() { page = 1, limit = 5, ...filter }: UserQueryParams
//   //   @Queries() query: UserQueryParams = { page: "1", limit: "1" }
//   // ): Promise<any> {
//   //   try {
//   //     console.log("Received query parameters:", query.limit);
//   //     const options = {
//   //       page: parseInt(query.page?.toString() || "1"),
//   //       limit: parseInt(query.limit?.toString() || "10"),
//   //     };
//   //     // count document;
//   //     console.log(options.limit);
//   //     const totalUser = await UserModel.countDocuments();
//   //     const totalPages = Math.ceil(totalUser / options.limit);
//   //     console.log(totalPages)
//   //     console.log(totalPages)
//   //     const users = await UserModel.find()
//   //       .skip((options.page - 1) * options.limit)
//   //       .limit(options.limit);

//   //     return { users, totalUser, totalPages, page: options.page };
//   //   } catch (error) {
//   //     console.error("Error:", error);
//   //     throw new Error("Bad Request: " + error); // Include specific error message
//   //   }
//   // }

//   // @Post("login")
//   // public async login(
//   //   @Response() response: ExpressResponse
//   //   @Body() requestBody: { email: string; password: string },
//   //   @Request() request: any,
//   // ): Promise<any> {
//   //   try {
//   //     console.log(requestBody.email, requestBody.password)
//   //     const findUser = await UserModel.findOne({ email: requestBody.email });
//   //     if (!findUser) {
//   //       throw new Error("email not found");
//   //     }
//   //     const isPasswordMatch = await bcrypt.compare(
//   //       requestBody.password,
//   //       findUser.password
//   //     );
//   //     if (!isPasswordMatch) {
//   //       throw new Error(" Password Invalid!")
//   //     }
//   //     // Generate JWT token
//   //     const token = jwt.sign(
//   //       { userId: findUser._id, email: findUser.email },
//   //       process.env.JWT_SECRET!,
//   //       { expiresIn: '1h' } // Token expiration time
//   //     );

//   //     // Set cookie with the JWT token
//   //     response.cookie('jwt', token, {
//   //       httpOnly: true,
//   //       // secure: true, // Enable in production (requires HTTPS)
//   //     });

//   //     return { message: 'Login successful', token };
//   //     // return { findUser, isPasswordMatch };
//   //   } catch (error) {
//   //     if (error instanceof Error) {
//   //       throw error; // Ensure a rejected promise is returned
//   //     } else {
//   //       // If 'error' is of type 'unknown', handle it accordingly
//   //       throw new Error("Unknown error occurred");
//   //     }
//   //   }
//   // }
// }

// // login service;

import {
  Controller,
  Route,
  Post,
  Body,
  Get,
  Path,
  Delete,
  Put,
  Query,
} from "tsoa";
import { UserModel, User } from "../database/models/user.models";
import bcrypt from "bcryptjs";
import validator from "validator";
import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "../utils/errors/customErrors";
import { StatusCodes, ReasonPhrases } from "../utils/constands/statusCodes";

interface UserQueryParams {
  page?: string;
  limit?: string;
  sortBy?: "age" | "fullName";
  sortOrder?: "asc" | "desc";
  gender?: "male" | "female";
  minAge?: string;
  maxAge?: string;
}

@Route("api/v1/users")
export class UsersController extends Controller {
  constructor() {
    super();
  }

  @Get()
  async getAllUser(
    @Query() query: UserQueryParams = { page: "1", limit: "10" }
  ): Promise<any> {
    try {
      const options = {
        page: parseInt(query.page?.toString() || "1"),
        limit: parseInt(query.limit?.toString() || "10"),
        sortBy: query.sortBy || "fullName",
        sortOrder: query.sortOrder === "desc" ? -1 : 1,
        gender: query.gender,
        minAge: parseInt(query.minAge?.toString() || "0"),
        maxAge: parseInt(query.maxAge?.toString() || "120"),
      };

      const filter: any = {};
      if (options.gender) {
        filter.gender = options.gender;
      }
      if (options.minAge !== undefined || options.maxAge !== undefined) {
        filter.age = {};
        if (options.minAge !== undefined) {
          filter.age.$gte = options.minAge;
        }
        if (options.maxAge !== undefined) {
          filter.age.$lte = options.maxAge;
        }
      }

      const totalUser = await UserModel.countDocuments(filter);
      const totalPages = Math.ceil(totalUser / options.limit);
      const sortOptions: { [key: string]: 1 | -1 } = {
        [options.sortBy]: options.sortOrder as 1 | -1,
      };

      const users = await UserModel.find(filter)
        .sort(sortOptions)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

      return { users, totalUser, totalPages, page: options.page };
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      throw new Error(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
      );
    }
  }

  @Get("{id}")
  public async getUser(@Path() id: string): Promise<User | null> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid user ID format");
      }
      const user = await UserModel.findById(id).exec();
      if (!user) {
        throw new NotFoundError(ReasonPhrases.NOT_FOUND);
      }
      return user;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new Error(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${error.message}`
      );
    }
  }

  @Put("{id}")
  public async updateUser(
    @Path() id: string,
    @Body()
    requestBody: {
      fullName?: string;
      email?: string;
      password?: string;
      status?: string;
      age?: number;
      gender?: "male" | "female";
    }
  ): Promise<any> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid user ID format");
      }
      const user = await UserModel.findById(id);
      if (!user) {
        throw new NotFoundError(ReasonPhrases.NOT_FOUND);
      }

      if (requestBody.fullName) user.fullName = requestBody.fullName;
      if (requestBody.email) user.email = requestBody.email;
      if (requestBody.password) {
        const hashedPassword = await bcrypt.hash(requestBody.password, 10);
        user.password = hashedPassword;
      }
      if (requestBody.status) user.status = requestBody.status;
      if (requestBody.age !== undefined) user.age = requestBody.age;
      if (requestBody.gender) user.gender = requestBody.gender;

      const updatedUser = await user.save();
      return {
        status: StatusCodes.OK,
        message: "User updated successfully",
        data: updatedUser,
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  @Delete("{id}")
  public async deleteUser(@Path() id: string): Promise<any> {
    try {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid user ID format");
      }
      const user = await UserModel.findById(id);
      if (!user) {
        throw new NotFoundError(ReasonPhrases.NOT_FOUND);
      }

      await UserModel.findByIdAndDelete(id);
      return { status: StatusCodes.OK, message: "Delete successfully" };
    } catch (error: any) {
      console.error("Error deleting user:", error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  @Post("register")
  public async createUser(
    @Body()
    requestBody: {
      username: string;
      email: string;
      password: string;
      fullName: string;
      age: number;
      gender: "male" | "female";
    }
  ): Promise<any> {
    try {
      if (
        !validator.isStrongPassword(requestBody.password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        throw new ValidationError(
          ReasonPhrases.BAD_REQUEST + ": Password is not strong enough"
        );
      }

      const hashedPassword = await bcrypt.hash(requestBody.password, 10);

      const newUser = new UserModel({
        fullName: requestBody.fullName,
        username: requestBody.username,
        email: requestBody.email,
        password: hashedPassword,
        age: requestBody.age,
        gender: requestBody.gender,
      });

      const savedUser = await newUser.save();
      this.setStatus(StatusCodes.CREATED); // Ensure correct status code is set
      return {
        status: StatusCodes.CREATED,
        message: "User registered successfully",
        data: savedUser,
      };
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === 11000) {
        throw new ValidationError(
          ReasonPhrases.BAD_REQUEST + ": Duplicate key error"
        );
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }
}
