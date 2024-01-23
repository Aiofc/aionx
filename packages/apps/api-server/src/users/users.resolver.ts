import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService } from '@aionx/data-access-admin';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.getUsers();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.getUser(id);
  }

  @Mutation(() => User)
  async addUser(@Args('data') data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
