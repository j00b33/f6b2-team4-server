import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoardImage } from './entities/boardImage.entity';

@Injectable()
export class BoardImageService {
  constructor(
    @InjectRepository(BoardImage) //db에 접근하기 위한 코딩
    private readonly boardImageRepository: Repository<BoardImage>, //db에 접근하기 위한 코딩
  ) {}
  // async create({ name }) {
  //   // 카테고리를 데이터 베이스에 저장

  //   const result = await this.carImageRepository.save({ image }); //name:name 생략가능
  //   console.log(result);

  //   return result;
  // }
  async findAll() {
    return await this.boardImageRepository.find({
      relations: ['board'],
    });
  }

  async find({ boardId }) {
    return await this.boardImageRepository.find({
      where: { board: boardId },
      relations: ['board'],
    });
  }

  async create({ image, board }) {
    const result = [];
    for (let i = 0; i < image.length; i++) {
      const newImage = await this.boardImageRepository.save({
        image: image[i],
        board,
      });
      result.push(newImage);
    }
    return result;
  }

  async update({ image, board }) {
    const result = [];
    await this.boardImageRepository.delete({ board });

    for (let i = 0; i < image.length; i++) {
      const newImage = await this.boardImageRepository.save({
        image: image[i],
        board,
      });
      result.push(newImage);
    }

    return result;
  }

  async delete({ image }) {
    const result = await this.boardImageRepository.softDelete({ image: image });
    return result.affected ? true : false;
  }
}
