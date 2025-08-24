export class StatusCode {
    public static CONFLICT = "CONFLICT" as const;
    public static NOT_FOUND = "NOT_FOUND" as const;
    public static BAD_REQUEST = "BAD_REQUEST" as const;
    public static UNAUTHORIZED = "UNAUTHORIZED" as const;
    public static MULTI_FACTOR_REQUIRED = "MULTI_FACTOR_REQUIRED" as const;
    public static MULTI_FACTOR_UNAUTHORIZED = "MULTI_FACTOR_UNAUTHORIZED" as const;
    public static INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR" as const;
}
