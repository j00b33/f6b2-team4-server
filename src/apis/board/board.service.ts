import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { BoardImage } from '../boardImage/entities/boardImage.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>, // @InjectRepository(BoardImage) // private readonly boardImageRepository: Repository<BoardImage>,
  ) {}

  async findAll() {
    return this.boardRepository.find();
  }

  async create({ createBoardInput }) {
    // const { boardImage, ...restBoardInput } = createBoardInput;
    // const imageResult = await this.boardImageRepository.save({ ...boardImage });

    // return await this.boardRepository.save({
    //   boardImage: imageResult,
    //   ...restBoardInput,
    // });

    return await this.boardRepository.save({ ...createBoardInput });
  }
}
