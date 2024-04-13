import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./users.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Users, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column()
    token: string;
}