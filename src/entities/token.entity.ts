import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./users.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column()
    token: string;
}