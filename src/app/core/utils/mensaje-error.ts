import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrae un mensaje legible del cuerpo de error del backend.
 *
 * El backend responde de dos formas distintas:
 * - Errores de negocio: { momento, estatus, error, mensaje, path }
 * - Errores de validación: { campo: "mensaje" }
 */
export function mensajeDeError(error: unknown, porDefecto: string): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
        return 'No se pudo conectar con el servidor.';
    }

    const cuerpo = (error as HttpErrorResponse | undefined)?.error;

    if (!cuerpo) {
        return porDefecto;
    }

    if (typeof cuerpo === 'string') {
        return cuerpo;
    }

    if (typeof cuerpo.mensaje === 'string') {
        return cuerpo.mensaje;
    }

    if (typeof cuerpo.message === 'string') {
        return cuerpo.message;
    }

    const primero = Object.values(cuerpo).find(valor => typeof valor === 'string');

    return typeof primero === 'string' ? primero : porDefecto;
}
