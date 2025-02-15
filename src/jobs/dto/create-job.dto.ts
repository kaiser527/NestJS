import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  skills: string[];

  @IsNotEmpty()
  salary: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
