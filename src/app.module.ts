import {forwardRef, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "./entities/users.entity";
import {UsersModule} from "./user/users.module";
import {AuthModule} from "./auth/auth.module";
import {JwtModule} from "@nestjs/jwt";
import {Token} from "./entities/token.entity";
import {BoardsModule} from "./boards/boards.module";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),
      UsersModule,
      AuthModule,
      BoardsModule,
      forwardRef(() => AuthModule),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('POSTGRES_HOST'),
              port: configService.get('POSTGRES_PORT'),
              username: configService.get('POSTGRES_USER'),
              password: configService.get('POSTGRES_PASSWORD'),
              database: configService.get('POSTGRES_DB'),
              entities: [__dirname + '/**/*.entity{.js, .ts}'],
              synchronize: true,
          }),
          inject: [ConfigService],
      }),
      JwtModule.register({
          global: true,
          secret: 'JWT_SECRET_KEY',
          signOptions: {expiresIn: '30m'}
      }),
      TypeOrmModule.forFeature([Users, Token]),
  ],
})
export class AppModule {}
