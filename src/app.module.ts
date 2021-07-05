import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { TipJar, TipJarSchema } from "./schema/tip-jar.schema";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URL || "mongodb://localhost/nest"),
    MongooseModule.forFeature([{name: TipJar.name, schema: TipJarSchema}])],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
