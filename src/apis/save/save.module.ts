import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Save } from './entities/save.entity';
import { SaveResolver } from './save.resolver';
import { SaveService } from './save.service';

@Module({
  imports: [TypeOrmModule.forFeature([Save, Board, User])],
  providers: [SaveResolver, SaveService],
})
export class SaveModule {}
