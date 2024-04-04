import {ApiProperty} from "@nestjs/swagger";
export class SignInDto {
    @ApiProperty({
        example: "test@gmail.com"
    })
    email: string

    @ApiProperty({
        example: "test"
    })
    password: string
}

export class SignOutDto {
    @ApiProperty({
        example: "test@gmail.com"
    })
    email: string
}