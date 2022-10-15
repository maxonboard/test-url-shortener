import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UrlDto } from './url.dtos';
import { UrlService } from './url.service';

@Resolver()
export class UrlResolver {
  constructor(private urlService: UrlService) {}

  @Query((_returns) => [UrlDto],  { name: 'urls' })
  getUrls() {
    return this.urlService.findAll();
  }

  // TODO VALIDATE longUrl has a valid URL format
  @Mutation((_returns) => UrlDto, { name: 'url' })
  saveUrl(@Args('url', { type: () => String }) longUrl: string) {
    return this.urlService.save(longUrl);
  }
}
