import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'The user model' })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
