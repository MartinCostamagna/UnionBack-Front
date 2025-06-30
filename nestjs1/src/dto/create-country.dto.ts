// src/country/dto/create-country.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty({ message: 'El nombre del país no puede estar vacío.' })
  @IsString({ message: 'El nombre del país debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre del país no debe exceder los 100 caracteres.' })
  name!: string;

  @IsOptional() // El código de país puede ser opcional
  @IsString({ message: 'El código del país debe ser una cadena de texto.' })
  @MaxLength(10, { message: 'El código del país no debe exceder los 10 caracteres.' })
  code?: string;
}
