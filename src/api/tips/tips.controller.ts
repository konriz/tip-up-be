import { Body, Controller, Post } from "@nestjs/common";
import { TipsService } from "./tips.service";
import { TipCreateDto } from "./dto/tip-create.dto";
import { Tip } from "../../schema/tip.embedded";

@Controller()
export class TipsController {
  constructor(private readonly tipsService: TipsService) {
  }

  @Post() sendTip(@Body() tipCreateDto: TipCreateDto): Promise<Tip> {
    return this.tipsService.sendTip(tipCreateDto);
  }

}
