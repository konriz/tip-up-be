import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { TipJar, TipJarSchema } from "./schema/tip-jar.schema";

@Module({
  imports: [MongooseModule.forRoot("mongodb://mongo/nest"),
    MongooseModule.forFeature([{name: TipJar.name, schema: TipJarSchema}])],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
