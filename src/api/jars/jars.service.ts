import { Injectable } from "@nestjs/common";
import { TipJar, TipJarDocument } from "../../schema/tip-jar.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class JarsService {

  constructor(@InjectModel(TipJar.name) private readonly tipJarModel: Model<TipJarDocument>) {
  }

  async getTipJarsList(): Promise<TipJar[]> {
    const tipJars = await this.tipJarModel.find().exec();
    return tipJars.map(tipJar => {
      delete tipJar.owner.secret;
      return tipJar;
    });
  }

}
