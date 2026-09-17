import { Body, Controller, Post } from '@nestjs/common';
import {
  estimateBcsFromChecklist,
  estimateWeight,
  getCarePlan,
  HennekeChecklistAnswers,
  WeightUnit,
} from '@asbaan/shared';

interface EstimateRequest {
  heartGirth: number;
  bodyLength: number;
  unit?: WeightUnit;
  checklist: HennekeChecklistAnswers;
  discipline: 'jumping' | 'dressage';
}

@Controller('v1/body-condition')
export class BodyConditionController {
  @Post('estimate')
  estimate(@Body() body: EstimateRequest) {
    const weight = estimateWeight(body.heartGirth, body.bodyLength, body.unit ?? 'metric');
    const bcs = estimateBcsFromChecklist(body.checklist);
    const carePlan = getCarePlan(bcs, body.discipline);
    return { weight, unit: body.unit ?? 'metric', bcs, carePlan };
  }
}
