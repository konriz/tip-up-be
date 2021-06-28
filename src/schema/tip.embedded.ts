import { Prop } from "@nestjs/mongoose";
import { Owner } from "./owner.schema";
import { Document } from "mongoose";

export class Tip extends Document {
  @Prop() amount: number;
  @Prop() message: number;
  @Prop(Owner) from: Owner;
  @Prop(Owner) to: Owner;

}
