import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TipJar, TipJarSchema } from "./schema/tip-jar.schema";
import { ConfigModule } from "@nestjs/config";
import { OwnersService } from "./api/owners/owners.service";
import { TipsService } from "./api/tips/tips.service";
import { JarsService } from "./api/jars/jars.service";
import { TipsController } from "./api/tips/tips.controller";
import { OwnersController } from "./api/owners/owners.controller";
import { JarsController } from "./api/jars/jars.controller";
import { SecretService } from "./api/owners/secret.service";

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URL || "mongodb://root:example@localhost"),
    MongooseModule.forFeature([{name: TipJar.name, schema: TipJarSchema}])],
  controllers: [JarsController, OwnersController, TipsController],
  providers: [JarsService, OwnersService, TipsService, SecretService]
})
export class AppModule {
}
