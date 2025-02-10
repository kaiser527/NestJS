import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.UserModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });
    return user;
  }

  async findAll() {
    let user = await this.UserModel.find();
    return user;
  }

  async findOne(id: string) {
    try {
      let user = await this.UserModel.findOne({ _id: id });
      return user;
    } catch (e) {
      return 'not found user';
    }
  }

  async findOnebyUsername(username: string) {
    return await this.UserModel.findOne({ email: username });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.UserModel.updateOne(
        { _id: updateUserDto.id },
        { ...updateUserDto },
      );
      return `This action updates a #${id} user`;
    } catch (e) {
      return 'not found user';
    }
  }

  async remove(id: string) {
    try {
      await this.UserModel.deleteOne({ _id: id });
      return `This action deletes a #${id} user`;
    } catch (e) {
      return 'not found user';
    }
  }
}
