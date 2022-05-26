import { AuthService } from "./auth.service";
import { Request } from "express";
import { Strategy } from "passport-jwt";
declare const RefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshStrategy extends RefreshStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(req: Request, payload: any): Promise<{
        username: string;
        sub: number;
    }>;
}
export {};
