import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentRegion } from './entities/currentRegion.entity';

@Injectable()
export class CurrentRegionService {
  constructor(
    @InjectRepository(CurrentRegion)
    private readonly currentRegionRepository: Repository<CurrentRegion>,
  ) {}

  async findAll() {
    return await this.currentRegionRepository.find();
  }

  async create({ currentRegionInput }) {
    await this.currentRegionRepository.save({ ...currentRegionInput });
  }

  async update({ updateCurrentRegionInput, currentRegionId }) {
    const oldInfo = await this.currentRegionRepository.findOne({
      where: { id: currentRegionId },
    });
    const newCurrentRegion = { ...oldInfo, ...updateCurrentRegionInput };

    return await this.currentRegionRepository.save(newCurrentRegion);
  }

  async delete({ currentRegionId }) {
    const result = await this.currentRegionRepository.softDelete({
      id: currentRegionId,
    });

    return result.affected ? true : false;
  }
}
