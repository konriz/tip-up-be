import { IsNotEmpty, IsString } from "class-validator";

export class OwnerDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() secret: string;
}
