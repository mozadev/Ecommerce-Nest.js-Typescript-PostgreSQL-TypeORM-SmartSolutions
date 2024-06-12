import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  //Transformar
  limit?: number;

  @IsOptional()
  @IsPositive()
  offset?: number;
}
