import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../../entities/url.entity';

@Injectable()
export class UrlService {
  private static readonly shortUrlAlphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async save(longUrl: string) {
    const url = await this.urlRepository.save({ url: longUrl });

    return {
      id: url.id,
      url: this.getShortUrlFromId(url.id)
    };
  }

  async findAll(): Promise<Url[]> {
    const urlEntities = await this.urlRepository.find();

    return urlEntities.map(urlEntity => ({
      ...urlEntity,
      shortUrl: `http://localhost:4000/${this.getShortUrlFromId(urlEntity.id)}`
    }));
  }

  findOne(id: number): Promise<Url> {
    return this.urlRepository.findOne({ where: { id } });
  }

  async findUrl(shortUrl: string) {
    const id = this.getIdFromShortUrl(shortUrl);

    // TODO Make findOne only retrieving the message column
    const urlEntity = await this.findOne(id);

    return urlEntity?.url;
  }

  private getShortUrlFromId(id: number) {
    const shortUrl = [];

    while (id)
    {
        shortUrl.push(UrlService.shortUrlAlphabet[id % 62]);
        id = Math.floor(id / 62);
    }

    shortUrl.reverse();

    return shortUrl.join("");
  }

  private getIdFromShortUrl(shortUrl: string) {
    let id = 0;
 
    for (let i = 0; i < shortUrl.length; i++) {
        if ('a' <= shortUrl[i] && shortUrl[i] <= 'z')
            id = id * 62 + shortUrl[i].charCodeAt(0) - 'a'.charCodeAt(0);
        if ('A' <= shortUrl[i] && shortUrl[i] <= 'Z')
            id = id * 62 + shortUrl[i].charCodeAt(0) - 'A'.charCodeAt(0) + 26;
        if ('0' <= shortUrl[i] && shortUrl[i] <= '9')
            id = id * 62 + shortUrl[i].charCodeAt(0) - '0'.charCodeAt(0) + 52;
    }

    return id;
  }
}
