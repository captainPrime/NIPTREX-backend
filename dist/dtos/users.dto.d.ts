export declare class CreateUserDto {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    profile_picture?: string;
    user: string;
    country?: string;
    referral_code: string;
}
export declare class UserLoginDto {
    email: string;
    password: string;
}
export declare class ResetPasswordDto {
    password: string;
    confirm_password: string;
}
