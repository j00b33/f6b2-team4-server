import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentRegionResolver } from './currentRegion.resolver';
import { CurrentRegionService } from './currentRegion.service';
import { CurrentRegion } from './entities/currentRegion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentRegion])],
  providers: [CurrentRegionResolver, CurrentRegionService],
})
export class CurrentRegionModule {}
