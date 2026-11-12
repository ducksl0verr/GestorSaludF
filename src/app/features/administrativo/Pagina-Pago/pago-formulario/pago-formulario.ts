import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, min, required } from '@angular/forms/signals';

import { Paciente } from '../../Pagina-Paciente/models/paciente';
import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';

import { PagoNuevo } from '../models/pago-nuevo';
import { PagoActualizar } from '../models/pago-actualizar';
import { PagoService } from '../services/pago-service';

@Component({
    selector: 'app-pago-formulario',
    imports: [FormField, RouterLink],
    templateUrl: './pago-formulario.html',
    styleUrl: './pago-formulario.css'
})
export class PagoFormulario implements OnInit {

    id: number | null = null;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private base = this.route.snapshot.data['base'];

    private pagoService = inject(PagoService);
    private pacienteService = inject(PacienteService);

    pacientes = signal<Paciente[]>([]);

    mensajeError = signal<string | null>(null);

    pagoModel = signal({
        monto: 0,
        fecha: '',
        idsPacientes: [] as number[]
    });

    pagoForm = form(this.pagoModel, (campo) => {
        required(campo.monto, { message: 'El monto es obligatorio.' });
        min(campo.monto, 1, { message: 'El monto debe ser mayor a cero.' });

        required(campo.fecha, { message: 'La fecha es obligatoria.' });

        required(campo.idsPacientes, {
            message: 'Debe seleccionar al menos un paciente.'
        });
    });

    ngOnInit(): void {
        this.cargarPacientes();

        const idParametro = this.route.snapshot.params['id'];

        if (idParametro) {
            this.id = Number(idParametro);
            this.cargarPago(this.id);
        }
    }

    cargarPacientes(): void {
        this.pacienteService.getPacientes().subscribe({
            next: (datos) => {
                this.pacientes.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los pacientes', error);
            }
        });
    }

    cargarPago(id: number): void {
        this.pagoService.getPago(id).subscribe({
            next: (datos) => {
                this.pagoModel.set({
                    monto: datos.monto,
                    fecha: datos.fecha.slice(0, 16),
                    idsPacientes: datos.pacientes.map((paciente) => paciente.id)
                });
            },
            error: (error) => {
                console.error('Error al cargar el pago', error);
            }
        });
    }

    agregarPaciente(idPaciente: number, event: Event): void {
        const seleccionado = (event.target as HTMLInputElement).checked;

        this.pagoModel.update((pago) => ({
            ...pago,
            idsPacientes: seleccionado
                ? [...pago.idsPacientes, idPaciente]
                : pago.idsPacientes.filter((id) => id !== idPaciente)
        }));
    }

    guardar(): void {

        this.mensajeError.set(null);

        if (this.pagoForm().invalid()) {
            this.pagoForm().markAsTouched();
            return;
        }

        const datos = this.pagoModel();

        if (datos.idsPacientes.length === 0) {
            alert('Debe seleccionar al menos un paciente.');
            return;
        }

        if (this.id === null) {

            const pagoNuevo: PagoNuevo = {
                monto: datos.monto,
                fecha: datos.fecha,
                idsPacientes: datos.idsPacientes
            };

            this.pagoService.guardarPago(pagoNuevo).subscribe({
                next: () => {
                    alert('Pago registrado correctamente');
                    this.router.navigate([this.base, 'pagos']);
                },
                error: (error) => {
                    console.error('Error al registrar el pago', error);
                    this.mensajeError.set(
                        this.obtenerMensajeError(error, 'No se pudo registrar el pago.')
                    );
                }
            });

        } else {

            const pagoActualizar: PagoActualizar = {
                monto: datos.monto,
                fecha: datos.fecha
            };

            this.pagoService.actualizarPago(this.id, pagoActualizar).subscribe({
                next: () => {
                    alert('Pago actualizado correctamente');
                    this.router.navigate([this.base, 'pagos']);
                },
                error: (error) => {
                    console.error('Error al actualizar el pago', error);
                    this.mensajeError.set(
                        this.obtenerMensajeError(error, 'No se pudo actualizar el pago.')
                    );
                }
            });
        }
    }

    private obtenerMensajeError(error: any, porDefecto: string): string {
        const cuerpo = error?.error;

        if (typeof cuerpo === 'string' && cuerpo.trim()) {
            return cuerpo;
        }

        if (cuerpo?.mensaje) {
            return cuerpo.mensaje;
        }

        if (cuerpo && typeof cuerpo === 'object') {
            const mensajes = Object.values(cuerpo)
                .filter((valor) => typeof valor === 'string');

            if (mensajes.length > 0) {
                return mensajes.join(' ');
            }
        }

        return porDefecto;
    }
}
