import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class TipCreateDto {
  @IsNotEmpty() @IsInt() @IsPositive() amount: number;
  @IsNotEmpty() message: string;
  @IsNotEmpty() fromName: string;
  @IsNotEmpty() secret: string;
  @IsNotEmpty() toName: string;
}
