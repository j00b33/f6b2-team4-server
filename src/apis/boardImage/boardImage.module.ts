import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImageResolver } from './boardImage.resolver';
import { BoardImageService } from './boardImage.service';
import { BoardImage } from './entities/boardImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardImage])],

  providers: [
    BoardImageResolver,
    BoardImageService, //
  ],
})
export class BoardImageModule {}
