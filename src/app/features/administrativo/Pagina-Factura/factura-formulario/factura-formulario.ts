import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';

import { Paciente } from '../../Pagina-Paciente/models/paciente';
import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';

import { TurnoFacturable } from '../../Pagina-Turno/models/turno-facturable';
import { TurnoService } from '../../Pagina-Turno/services/turno-service';

import { FacturaNueva } from '../models/factura-nueva';
import { FacturaService } from '../services/factura-service';

@Component({
    selector: 'app-factura-formulario',
    imports: [CommonModule, FormField, RouterLink],
    templateUrl: './factura-formulario.html',
    styleUrl: './factura-formulario.css'
})
export class FacturaFormulario implements OnInit {

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private base = this.route.snapshot.data['base'];

    private facturaService = inject(FacturaService);
    private pacienteService = inject(PacienteService);
    private turnoService = inject(TurnoService);

    pacientes = signal<Paciente[]>([]);
    turnosFacturables = signal<TurnoFacturable[]>([]);

    mensajeError = signal<string | null>(null);

    facturaModel = signal({
        idPaciente: '0',
        idsTurnos: [] as number[]
    });

    facturaForm = form(this.facturaModel, (campo) => {
        required(campo.idPaciente, { message: 'Debe seleccionar un paciente.' });
        required(campo.idsTurnos, {
            message: 'Debe seleccionar al menos un turno.'
        });
    });

    ngOnInit(): void {
        this.cargarPacientes();
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

    seleccionarPaciente(event: Event): void {
        const idPaciente = Number((event.target as HTMLSelectElement).value);

        this.mensajeError.set(null);
        this.turnosFacturables.set([]);
        this.facturaModel.update((factura) => ({
            ...factura,
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
                console.error('Error al cargar los turnos facturables', error);
            }
        });
    }

    agregarTurno(idTurno: number, event: Event): void {
        const seleccionado = (event.target as HTMLInputElement).checked;

        this.facturaModel.update((factura) => ({
            ...factura,
            idsTurnos: seleccionado
                ? [...factura.idsTurnos, idTurno]
                : factura.idsTurnos.filter((id) => id !== idTurno)
        }));
    }

    guardar(): void {

        this.mensajeError.set(null);

        if (this.facturaForm().invalid()) {
            this.facturaForm().markAsTouched();
            return;
        }

        const datos = this.facturaModel();

        if (Number(datos.idPaciente) < 1) {
            alert('Debe seleccionar un paciente.');
            return;
        }

        if (datos.idsTurnos.length === 0) {
            alert('Debe seleccionar al menos un turno para facturar.');
            return;
        }

        const facturaNueva: FacturaNueva = {
            idsTurnos: datos.idsTurnos
        };

        this.facturaService.guardarFactura(facturaNueva).subscribe({
            next: () => {
                alert('Factura registrada correctamente');
                this.router.navigate([this.base, 'facturas']);
            },
            error: (error) => {
                console.error('Error al registrar la factura', error);
                this.mensajeError.set(
                    this.obtenerMensajeError(error, 'No se pudo registrar la factura.')
                );
            }
        });
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
