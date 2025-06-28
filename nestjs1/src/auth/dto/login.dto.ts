// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El email no puede estar vacío.'})
  @IsEmail({}, { message: 'Debe proporcionar un email válido.'})
  email!: string; // '!' para compatibilidad con strictPropertyInitialization

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.'})
  @IsString({ message: 'La contraseña debe ser una cadena de texto.'})
  // No es necesario validar complejidad aquí, solo que no esté vacía.
  // La validación de complejidad se hace al crear/actualizar la contraseña de la persona.
  @MinLength(6, { message: 'La contraseña es requerida y debe tener al menos 6 caracteres.'})
  password!: string; // '!' para compatibilidad con strictPropertyInitialization
}
