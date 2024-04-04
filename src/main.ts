import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser";
async function start() {
  try {
    const PORT = 5000
    const app = await NestFactory.create(AppModule,{ cors: true });

    const config = new DocumentBuilder()
        .setTitle('API build')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.use(cookieParser())
    await app.listen(PORT, () => console.log(`server start on PORT=${PORT}`));
  } catch (e) {
    console.log(e.message)
  }
}
start()