import { Body, Controller, Post } from "@nestjs/common";
import { TipsService } from "./tips.service";
import { TipCreateDto } from "../../dto/tip-create.dto";

@Controller()
export class TipsController {
  constructor(private readonly tipsService: TipsService) {
  }

  @Post() sendTip(@Body() tipCreateDto: TipCreateDto): Promise<void> {
    return this.tipsService.sendTip(tipCreateDto);
  }

}
