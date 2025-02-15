import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.UserModel.findOne({
      email: createUserDto.email,
    });
    if (isExist) throw new BadRequestException('User is already exist');
    const hashPassword = this.getHashPassword(createUserDto.password);
    let result = await this.UserModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      age: createUserDto.age,
      gender: createUserDto.gender,
      address: createUserDto.address,
      role: createUserDto.role,
      company: createUserDto.company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    let find = await this.UserModel.findOne({ email: result.email });
    return {
      _id: find._id,
      createdAt: find.createdAt,
    };
  }

  async register(user: RegisterUserDto) {
    const isExist = await this.UserModel.findOne({ email: user.email });
    if (isExist)
      throw new BadRequestException(
        'Your email is already exist, please try another email',
      );
    const hashPassword = this.getHashPassword(user.password);
    let result = await this.UserModel.create({
      email: user.email,
      password: hashPassword,
      name: user.name,
      age: user.age,
      gender: user.gender,
      address: user.address,
      role: 'USER',
    });
    let find = await this.UserModel.findOne({ email: result.email });
    return {
      _id: find._id,
      createdAt: find.createdAt,
    };
  }

  async findAll(limit: number, page: number, qs: string) {
    const { sort, filter, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (page - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.UserModel.findOne({ _id: id }).select('-password');
  }

  async findOnebyUsername(username: string) {
    return await this.UserModel.findOne({ email: username });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    id = updateUserDto._id;
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    await this.UserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.UserModel.softDelete({ _id: id });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.UserModel.updateOne({ _id: _id }, { refreshToken });
  };

  setNullUserToken = async (_id: string) => {
    return await this.UserModel.updateOne({ _id: _id }, { refreshToken: null });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken });
  };
}
