import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Owner } from "./owner.schema";
import * as mongoose from "mongoose";
import { Tip } from "./tip.embedded";

export type TipJarDocument = TipJar & mongoose.Document;

@Schema()
export class TipJar {
  @Prop(Owner) owner: Owner;
  @Prop([Tip]) tipsReceived: Tip[];
  @Prop([Tip]) tipsGiven: Tip[];
}

export const TipJarSchema = SchemaFactory.createForClass(TipJar);
