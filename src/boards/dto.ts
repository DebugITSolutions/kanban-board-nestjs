import {ApiProperty} from "@nestjs/swagger";

export class BoardsCreateDto {
    @ApiProperty({
        example: "new board"
    })
    title: string;

    @ApiProperty({
        example: 1
    })
    user_id: number;
}

export class BoardAddUserDto {
    @ApiProperty({
        example: 1
    })
    board_id: number;

    @ApiProperty({
        example: 1
    })
    user_id: number;
}

export class BoardAddColumnDto {
    @ApiProperty({
        example: 1
    })
    board_id: number;

    @ApiProperty({
        example: 'Новая колонка'
    })
    columnTitle: string;
}

export class BoardAddCardDto {
    @ApiProperty({
        example: 1
    })
    column_id: number;

    @ApiProperty({
        example: 'Новая карточка'
    })
    cardTitle: string;
}

export class MoveCardAtColumnDto {
    @ApiProperty({
        example: 1
    })
    board_id: number;

    @ApiProperty({
        example: 'Новая колонка'
    })
    columnTitle: string;
}
