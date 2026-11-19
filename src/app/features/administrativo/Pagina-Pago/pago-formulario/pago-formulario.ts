import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, min, required } from '@angular/forms/signals';

import { Paciente } from '../../Pagina-Paciente/models/paciente';
import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';

import { TurnoFacturable } from '../../Pagina-Turno/models/turno-facturable';
import { TurnoService } from '../../Pagina-Turno/services/turno-service';

import { PagoNuevo } from '../models/pago-nuevo';
import { PagoActualizar } from '../models/pago-actualizar';
import { PagoService } from '../services/pago-service';

@Component({
    selector: 'app-pago-formulario',
    imports: [CommonModule, FormField, RouterLink],
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
    private turnoService = inject(TurnoService);

    pacientes = signal<Paciente[]>([]);
    turnosFacturables = signal<TurnoFacturable[]>([]);

    mensajeError = signal<string | null>(null);

    pagoModel = signal({
        monto: 0,
        fecha: '',
        idPaciente: '0',
        idsTurnos: [] as number[]
    });

    pagoForm = form(this.pagoModel, (campo) => {
        min(campo.monto, 1, { message: 'El monto debe ser mayor a cero.' });

        required(campo.fecha, { message: 'La fecha es obligatoria.' });

        required(campo.idPaciente, { message: 'Debe seleccionar un paciente.' });

        required(campo.idsTurnos, {
            message: 'Debe seleccionar al menos un turno para pagar.'
        });
    });

    totalSeleccionado = computed(() =>
        this.turnosFacturables()
            .filter((turno) => this.pagoModel().idsTurnos.includes(turno.id_turno))
            .reduce((total, turno) => total + Number(turno.monto), 0)
    );

    ngOnInit(): void {
        this.cargarPacientes();

        const idParametro = this.route.snapshot.params['id'];

        if (idParametro) {
            this.id = Number(idParametro);
            this.cargarPago(this.id);
        } else {
            this.pagoModel.update((pago) => ({
                ...pago,
                fecha: this.fechaLocalParaInput(new Date())
            }));
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
                    idPaciente: datos.pacientes[0]?.id.toString() ?? '0',
                    idsTurnos: []
                });
            },
            error: (error) => {
                console.error('Error al cargar el pago', error);
            }
        });
    }

    seleccionarPaciente(event: Event): void {
        const idPaciente = Number((event.target as HTMLSelectElement).value);

        this.mensajeError.set(null);
        this.turnosFacturables.set([]);
        this.pagoModel.update((pago) => ({
            ...pago,
            idPaciente: idPaciente.toString(),
            idsTurnos: []
        }));

        if (idPaciente > 0) {
            this.cargarTurnosFacturables(idPaciente);
        }
    }

    cargarTurnosFacturables(idPaciente: number): void {
        this.turnoService.getTurnosFacturables(idPaciente).subscribe({
            next: (datos) => {
                this.turnosFacturables.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los turnos por pagar', error);
                this.mensajeError.set(
                    this.obtenerMensajeError(error, 'No se pudieron cargar los turnos por pagar.')
                );
            }
        });
    }

    agregarTurno(idTurno: number, event: Event): void {
        const seleccionado = (event.target as HTMLInputElement).checked;

        this.pagoModel.update((pago) => ({
            ...pago,
            idsTurnos: seleccionado
                ? [...pago.idsTurnos, idTurno]
                : pago.idsTurnos.filter((id) => id !== idTurno)
        }));
    }

    actualizarMonto(): void {
        this.pagoModel.update((pago) => ({
            ...pago,
            monto: this.totalSeleccionado()
        }));
    }

    guardar(): void {
        this.mensajeError.set(null);

        const esNuevo = this.id === null;

        if (esNuevo) {
            if (this.pagoForm().invalid()) {
                this.pagoForm().markAsTouched();
                return;
            }
        } else if (this.pagoForm.monto().invalid() || this.pagoForm.fecha().invalid()) {
            this.pagoForm().markAsTouched();
            return;
        }

        const datos = this.pagoModel();

        if (esNuevo && Number(datos.idPaciente) < 1) {
            alert('Debe seleccionar un paciente.');
            return;
        }

        if (esNuevo && datos.idsTurnos.length === 0) {
            alert('Debe seleccionar al menos un turno para pagar.');
            return;
        }

        if (esNuevo && datos.monto !== this.totalSeleccionado()) {
            this.actualizarMonto();
        }

        if (esNuevo) {
            const fechaActual = this.fechaLocalParaInput(new Date());
            this.pagoModel.update((pago) => ({ ...pago, fecha: fechaActual }));

            const pagoNuevo: PagoNuevo = {
                monto: datos.monto,
                fecha: fechaActual,
                idsPacientes: [Number(datos.idPaciente)],
                idsTurnos: datos.idsTurnos
            };

            this.pagoService.guardarPago(pagoNuevo).subscribe({
                next: () => {
                    alert('Pago registrado y factura generada correctamente');
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

            this.pagoService.actualizarPago(this.id!, pagoActualizar).subscribe({
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

    private fechaLocalParaInput(fecha: Date): string {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');

        return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
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
