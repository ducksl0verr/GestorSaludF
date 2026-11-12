import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, min, required } from '@angular/forms/signals';

import { Proveedor } from '../../../public/Pagina-Proveedor/model/Proveedor';
import { ProveedorService } from '../../../public/Pagina-Proveedor/Service/proveedor-service';

import { GastoNuevo } from '../models/gasto-nuevo';
import { GastoActualizar } from '../models/gasto-actualizar';
import { GastoService } from '../services/gasto-service';
import { METODOS_PAGO, MetodoPago } from '../models/metodo-pago';
import { TIPOS_GASTO, TipoGasto } from '../models/tipo-gasto';

@Component({
    selector: 'app-gasto-formulario',
    imports: [FormField, RouterLink],
    templateUrl: './gasto-formulario.html',
    styleUrl: './gasto-formulario.css'
})
export class GastoFormulario implements OnInit {

    id: number | null = null;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private base = this.route.snapshot.data['base'];

    private gastoService = inject(GastoService);
    private proveedorService = inject(ProveedorService);

    proveedores = signal<Proveedor[]>([]);

    tiposGasto = TIPOS_GASTO;
    metodosPago = METODOS_PAGO;

    gastoModel = signal({
        fecha: '',
        descripcion: '',
        monto: 0,
        tipoGasto: '' as TipoGasto | '',
        nombreProveedor: '',
        metodoPago: '' as MetodoPago | '',
        observaciones: ''
    });

    gastoForm = form(this.gastoModel, (campo) => {
        required(campo.fecha, { message: 'La fecha es obligatoria.' });
        required(campo.descripcion, { message: 'La descripción es obligatoria.' });
        required(campo.monto, { message: 'El monto es obligatorio.' });
        min(campo.monto, 1, { message: 'El monto debe ser mayor a cero.' });
        required(campo.tipoGasto, { message: 'El tipo de gasto es obligatorio.' });
        required(campo.nombreProveedor, { message: 'El proveedor es obligatorio.' });
        required(campo.metodoPago, { message: 'El método de pago es obligatorio.' });
        required(campo.observaciones, { message: 'Las observaciones son obligatorias.' });
    });

    ngOnInit(): void {
        this.cargarProveedores();

        const idParametro = this.route.snapshot.params['id'];

        if (idParametro) {
            this.id = Number(idParametro);
            this.cargarGasto(this.id);
        }
    }

    cargarProveedores(): void {
        this.proveedorService.getProveedores().subscribe({
            next: (datos) => {
                this.proveedores.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los proveedores', error);
            }
        });
    }

    cargarGasto(id: number): void {
        this.gastoService.getGasto(id).subscribe({
            next: (datos) => {
                this.gastoModel.set({
                    fecha: datos.fecha,
                    descripcion: datos.descripcion,
                    monto: datos.monto,
                    tipoGasto: datos.tipoGasto,
                    nombreProveedor: datos.nombreProveedor,
                    metodoPago: datos.metodoPago,
                    observaciones: datos.observaciones
                });
            },
            error: (error) => {
                console.error('Error al cargar el gasto', error);
            }
        });
    }

    guardar(): void {

        if (this.gastoForm().invalid()) {
            this.gastoForm().markAsTouched();
            return;
        }

        const datos = this.gastoModel();

        if (this.id === null) {

            const gastoNuevo: GastoNuevo = {
                fecha: datos.fecha,
                descripcion: datos.descripcion,
                monto: datos.monto,
                tipoGasto: datos.tipoGasto as TipoGasto,
                nombreProveedor: datos.nombreProveedor,
                metodoPago: datos.metodoPago as MetodoPago,
                observaciones: datos.observaciones
            };

            this.gastoService.guardarGasto(gastoNuevo).subscribe({
                next: () => {
                    alert('Gasto registrado correctamente');
                    this.router.navigate([this.base, 'gastos']);
                },
                error: (error) => {
                    console.error('Error al registrar el gasto', error);
                }
            });

        } else {

            const gastoActualizar: GastoActualizar = {
                fecha: datos.fecha,
                descripcion: datos.descripcion,
                monto: datos.monto,
                tipoGasto: datos.tipoGasto as TipoGasto,
                metodoPago: datos.metodoPago as MetodoPago,
                observaciones: datos.observaciones
            };

            this.gastoService.actualizarGasto(this.id, gastoActualizar).subscribe({
                next: () => {
                    alert('Gasto actualizado correctamente');
                    this.router.navigate([this.base, 'gastos']);
                },
                error: (error) => {
                    console.error('Error al actualizar el gasto', error);
                }
            });
        }
    }
}
