import { Controller, Get } from "@nestjs/common";
import { JarsService } from "./jars.service";
import { TipJar } from "../../schema/tip-jar.schema";

@Controller()
export class JarsController {
  constructor(private readonly jarsService: JarsService) {
  }

  @Get() getTipJarsList(): Promise<TipJar[]> {
    return this.jarsService.getTipJarsList();
  }
}
