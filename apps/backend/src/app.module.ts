import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HorsesModule } from './horses/horses.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RiskModule } from './risk/risk.module';
import { TechniqueModule } from './technique/technique.module';
import { BodyConditionModule } from './body-condition/body-condition.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    HorsesModule,
    BookingsModule,
    ReviewsModule,
    FeedbackModule,
    RiskModule,
    TechniqueModule,
    BodyConditionModule,
    PaymentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
