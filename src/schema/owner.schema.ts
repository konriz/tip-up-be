import { Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

export class Owner extends Document {
  @Prop() name: string;
  @Prop() secret?: string;
}
