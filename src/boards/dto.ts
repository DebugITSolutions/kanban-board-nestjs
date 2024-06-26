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
    card_id: number;

    @ApiProperty({
        example: 1
    })
    column_id: number;
}

export class ChangeCardTitleDto {
    @ApiProperty({
        example: 1
    })
    card_id: number

    @ApiProperty({
        example: 'new card title'
    })
    card_title: string
}

export class ChangeBoardTitleDto {
    @ApiProperty({
        example: 1
    })
    board_id: number

    @ApiProperty({
        example: 'new board title'
    })
    board_title: string
}

export class ChangeColumnTitleDto {
    @ApiProperty({
        example: 1
    })
    column_id: number

    @ApiProperty({
        example: 'new column title'
    })
    column_title: string
}

export class DeleteCardDto{
    @ApiProperty({
        example: 1
    })
    card_id: number
}

export class DeleteBoardDto {
    @ApiProperty({
        example: 1
    })
    board_id: number
}

export class DeleteColumnDto {
    @ApiProperty({
        example: 1
    })
    column_id: number
}

export class DeleteUserDto {
    @ApiProperty({
        example: 1
    })
    user_id: number

    @ApiProperty({
        example: 1
    })
    board_id: number
}