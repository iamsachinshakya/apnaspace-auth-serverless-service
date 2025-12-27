import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/utils/apiError";
import { ErrorCode } from "../../common/constants/errorCodes";
import { secureCookieOptions } from "../utils/auth.util";
import { IAuthController } from "./auth.controller.interface";
import { IAuthService } from "../services/auth.service.interface";
import { IQueryParams } from "../../common/models/common.dto";
import { PAGINATION_PAGE_LIMIT } from "../../common/constants/constants";
import { IUpdateAuth } from "../models/auth.dto";

export class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) { }


  async updateById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updates: IUpdateAuth = req.body;

    if (!id) throw new ApiError("Auth ID is required", 400, ErrorCode.BAD_REQUEST);
    if (!updates || Object.keys(updates).length === 0) throw new ApiError("No update data provided", 400, ErrorCode.BAD_REQUEST);

    const updated = await this.authService.updateAuth(id, updates);

    return ApiResponse.success(res, "Account details updated successfully", updated);
  }

  async deleteById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) throw new ApiError("Auth ID is required", 400, ErrorCode.BAD_REQUEST);

    await this.authService.deleteAuth(id);
    return ApiResponse.success(res, "User deleted successfully", null, 200);
  }


  async getAll(req: Request, res: Response): Promise<Response> {
    const query: IQueryParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || PAGINATION_PAGE_LIMIT,
      search: (req.query.search as string) || "",
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const users = await this.authService.getAllUsers(query);

    return ApiResponse.success(res, "Auth Users fetched successfully", users);
  }

  async register(req: Request, res: Response): Promise<Response> {
    const user = await this.authService.registerUser(req.body);
    return ApiResponse.success(res, "User registered successfully", user, 201);
  }

  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      throw new ApiError("User missing", 400, ErrorCode.BAD_REQUEST);
    }
    return ApiResponse.success(res, "Current user fetched successfully", user);
  }


  async login(req: Request, res: Response): Promise<Response> {
    const { user, accessToken, refreshToken } =
      await this.authService.loginUser(req.body);

    res.cookie("accessToken", accessToken, secureCookieOptions);
    res.cookie("refreshToken", refreshToken, secureCookieOptions);

    return ApiResponse.success(res, "User logged in successfully", {
      user,
      accessToken,
      refreshToken,
    });
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError("User ID missing", 400, ErrorCode.BAD_REQUEST);
    }

    await this.authService.logoutUser(userId);

    res.clearCookie("accessToken", secureCookieOptions);
    res.clearCookie("refreshToken", secureCookieOptions);

    return ApiResponse.success(res, "User logged out successfully");
  }

  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    const { accessToken } =
      await this.authService.refreshAccessToken(incomingRefreshToken);

    res.cookie("accessToken", accessToken, secureCookieOptions);

    return ApiResponse.success(res, "Access token refreshed successfully");
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    await this.authService.resetPassword({ email, password });
    return ApiResponse.success(res, "Password reset successfully");
  }
}
