// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core'; // <-- Ya tenías este import, perfecto.

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  // <-- PASO 1: AÑADIMOS EL CONSTRUCTOR PARA INYECTAR REFLECTOR
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determina si la solicitud actual puede ser manejada por el endpoint.
   * Este método es llamado por NestJS antes de que el controlador o manejador de ruta sea ejecutado.
   * @param context El contexto de ejecución de la solicitud.
   * @returns true si la solicitud está autorizada, de lo contrario lanza una excepción o retorna false.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // <-- PASO 2: AÑADIMOS LA LÓGICA PARA REVISAR SI LA RUTA ES PÚBLICA
    // Usamos Reflector para buscar la metadata 'isPublic' que pusimos con el decorador.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta es pública (tiene el decorador @Public()), permitimos el acceso inmediatamente.
    if (isPublic) {
      return true;
    }

    // Si la ruta NO es pública, continuamos con la validación de JWT normal.
    // Llama al método canActivate de la clase base (AuthGuard('jwt'))
    // Este se encargará de ejecutar la lógica de la JwtStrategy.
    this.logger.debug('JwtAuthGuard: La ruta no es pública, procediendo a validar JWT...');
    return super.canActivate(context);
  }

  /**
   * Maneja el resultado de la autenticación.
   * Este método es llamado por AuthGuard después de que la estrategia (JwtStrategy) ha procesado la solicitud.
   * @param err Cualquier error ocurrido durante la autenticación.
   * @param user El objeto de usuario retornado por JwtStrategy.validate(), o false si la autenticación falló.
   * @param info Información adicional o mensaje de error de la estrategia.
   * @returns El objeto de usuario si la autenticación fue exitosa.
   * @throws UnauthorizedException si la autenticación falla.
   */
  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      this.logger.warn(`JwtAuthGuard: Autenticación fallida. Error: ${err}, Info: ${info?.message || info}`);
      throw err || new UnauthorizedException(info?.message || 'No estás autorizado para acceder a este recurso.');
    }
    this.logger.debug('JwtAuthGuard: Autenticación exitosa. Usuario adjuntado a la solicitud.');
    return user; // Si la autenticación es exitosa, 'user' se adjunta a request.user
  }
}