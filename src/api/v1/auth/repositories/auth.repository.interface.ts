import { IQueryParams, PaginatedData } from "../../common/models/common.dto";
import { IAuthDashboard, IUpdateAuth } from "../models/auth.dto";
import { IAuthEntity } from "../models/auth.entity";

/**
 * Interface for Auth repository.
 * Defines methods for accessing and manipulating auth-related data in the database.
 */
export interface IAuthRepository {

    /**
    * Find a All auth user.
    * @param params - params.
    * @returns A Promise resolving to the auth users with pagination.
    */
    findAll(
        params: IQueryParams
    ): Promise<PaginatedData<IAuthDashboard>>

    /**
     * Find a auth user by email.
     * @param email - The email of the auth user.
     * @returns A Promise resolving to the auth user entity or null if not found.
     */
    findByEmail(email: string): Promise<IAuthEntity | null>;

    /**
     * Find a auth user by username.
     * @param username - The username of the auth user.
     * @returns A Promise resolving to the auth user entity or null if not found.
     */
    findByUsername(username: string): Promise<IAuthEntity | null>;

    /**
     * Find a auth user by ID.
     * @param id - The unique ID of the auth user.
     * @returns A Promise resolving to the auth user entity or null if not found.
     */
    findById(id: string): Promise<IAuthEntity | null>;

    /**
     * Create a new auth user.
     * @param data - The data to create a new auth user.
     * @returns A Promise resolving to the created auth user entity or null.
     */
    create(data: IAuthEntity): Promise<IAuthEntity | null>;

    /**
     * Remove the refresh token of a auth user by their ID.
     * @param id - The unique ID of the auth user.
     * @returns A Promise resolving to the updated auth user entity or null.
     */
    removeRefreshTokenById(id: string): Promise<IAuthEntity | null>;

    /**
     * Update a auth user by ID with partial data.
     * @param id - The unique ID of the auth user.
     * @param data - Partial data to update the auth user.
     * @returns A Promise resolving to the updated auth user entity or null.
     */
    updateById(
        id: string,
        data: Partial<IUpdateAuth>
    ): Promise<IAuthEntity | null>;

    updateRefreshTokenId(
        id: string,
        data: { refreshToken: string, updateDate: Date }
    ): Promise<IAuthEntity | null>;

    /**
     * Delete a auth user by their ID.
     * @param id - The unique ID of the auth user.
     * @returns A Promise resolving to the deleted auth user entity or null.
     */
    deleteById(id: string): Promise<IAuthEntity | null>;
}
