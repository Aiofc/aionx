import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;
}
