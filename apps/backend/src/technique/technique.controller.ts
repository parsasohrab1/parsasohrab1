import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TechniqueService } from './technique.service';
import { TECHNIQUE_CRITERIA, VideoSubmission } from '@asbaan/shared';

@Controller('v1/technique')
export class TechniqueController {
  constructor(private readonly technique: TechniqueService) {}

  @Get('criteria')
  criteria() {
    return TECHNIQUE_CRITERIA;
  }

  @Post('videos')
  submit(@Body() body: Pick<VideoSubmission, 'riderId' | 'horseId' | 'discipline' | 'videoUrl'>) {
    return this.technique.submit(body);
  }

  @Post('videos/:id/analyze')
  analyze(@Param('id') id: string) {
    return this.technique.analyze(id);
  }

  @Get('videos/:id')
  getResult(@Param('id') id: string) {
    return this.technique.getResult(id);
  }
}
