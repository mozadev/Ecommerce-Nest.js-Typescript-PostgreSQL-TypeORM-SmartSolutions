export class CreateProductDto {
  title: string;
  price?: number;
  description?: string;
  slug?: string;
  stock?: number;
  sizes: string[];
  gender: string;
}
