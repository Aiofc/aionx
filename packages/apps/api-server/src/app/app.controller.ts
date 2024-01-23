import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { PostService } from '@aionx/data-access-kcms';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postService: PostService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('posts')
  getPosts() {
    return this.postService.getPosts();
  }

  @Post('posts')
  createPost() {
    return this.postService.createPost({
      title: 'Hello World',
      content: 'This is a test post',
    });
  }
}
