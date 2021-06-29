import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const originFunction = (origin: any, callback: any) => {
    callback(null, true);
  };
  const corsOptions = {
    origin: originFunction
  };
  app.enableCors(corsOptions);

  await app.listen(3000);
}

bootstrap();
