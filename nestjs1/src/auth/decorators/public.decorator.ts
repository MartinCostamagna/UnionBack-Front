// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';
// Esta es la "llave" que usaremos para identificar los endpoints públicos.
export const IS_PUBLIC_KEY = 'isPublic';
// Este es el decorador @Public() que usarás en tus controladores.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);