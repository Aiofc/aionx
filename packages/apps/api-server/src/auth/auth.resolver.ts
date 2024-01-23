import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignupInput } from './dto/signup.input';
import { Auth } from './models/auth.model';
import { AuthService } from './auth.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }
}
