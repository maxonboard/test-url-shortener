import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UrlDto {
  @Field((_type) => Int, { nullable: true })
  id?: number;

  @Field()
  url: string;

  @Field((_type) => String, { nullable: true })
  shortUrl: string;
}
