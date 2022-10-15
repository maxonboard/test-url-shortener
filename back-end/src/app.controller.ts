import { Controller, Get, HttpException, HttpStatus, Param, Redirect } from '@nestjs/common';
import { UrlService } from './modules/url/url.service';

@Controller('')
export class AppController {
  constructor(private readonly urlService: UrlService) {}

  @Redirect()
  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string) {
    const url = await this.urlService.findUrl(shortUrl);

    if (url === undefined) {
      throw new HttpException(`http://localhost:4000/${shortUrl} not found`, HttpStatus.NOT_FOUND)
    }

    return { statusCode: HttpStatus.FOUND, url };
  }
}
