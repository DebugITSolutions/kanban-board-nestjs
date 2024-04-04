import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        example: "test@gmail.com"
    })
    email: string;

    @ApiProperty({
        example: "test"
    })
    name: string;

    @ApiProperty({
        example: "test"
    })
    password: string;
}