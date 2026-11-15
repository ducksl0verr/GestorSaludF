import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FormField, form, required, min, applyEach } from '@angular/forms/signals';

import { RecetaService } from '../services/receta-services';
import { RecetaNueva } from '../model/receta';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';
import { MedicamentoService } from '../../../public/Pagina-Medicamento/Service/medicamento-service';
import { Medicamento } from '../../../public/Pagina-Medicamento/Model/Medicamento';

@Component({
  selector: 'app-receta-form',
  imports: [FormField, RouterModule, CommonModule],
  templateUrl: './receta-formulario.html',
  styleUrl: './receta-formulario.css'
})
export class RecetaFormulario implements OnInit {

  private recetasService = inject(RecetaService);
  private medicamentoService = inject(MedicamentoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  private base = this.route.snapshot.data['base'];

  cargando = signal(false);
  error = signal('');
  pacientePrecargado = signal(false);

  /// Medicamentos cargados en el sistema para elegirlos desde el formulario.
  medicamentos = signal<Medicamento[]>([]);
  cargandoMedicamentos = signal(false);
  errorMedicamentos = signal('');

  modelo = signal<RecetaNueva>({
    id_paciente: 0,
    id_profesional: 0,
    detalles: [
      {
        dosis: '',
        frecuencia: '',
        cantidad: 1,
        id_medicamento: 0
      }
    ]
  });

  formulario = form(this.modelo, (schema) => {

    min(schema.id_paciente, 1);
    min(schema.id_profesional, 1);

    applyEach(schema.detalles, (detalle) => {
      required(detalle.dosis);
      required(detalle.frecuencia);
      min(detalle.cantidad, 1);
      min(detalle.id_medicamento, 1);
    });

  });

  ngOnInit(): void {
    /// Receta iniciada desde el detalle de un paciente:
    /// se precargan el paciente y el profesional logueado.
    const rawPaciente = this.route.snapshot.queryParamMap.get('paciente');
    const paciente = Number(rawPaciente);
    const profesional = this.auth.getUsuarioId();

    if (rawPaciente && Number.isInteger(paciente) && paciente > 0) {
      this.modelo.update(datos => ({
        ...datos,
        id_paciente: paciente
      }));

      this.pacientePrecargado.set(true);
    }

    if (profesional) {
      this.modelo.update(datos => ({
        ...datos,
        id_profesional: profesional
      }));
    }

    this.cargarMedicamentos();
  }

  cargarMedicamentos(): void {

    this.cargandoMedicamentos.set(true);
    this.errorMedicamentos.set('');

    this.medicamentoService.getMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos.set(data);
        this.cargandoMedicamentos.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los medicamentos', err);
        this.errorMedicamentos.set('No se pudieron cargar los medicamentos.');
        this.cargandoMedicamentos.set(false);
      }
    });
  }

  cambiarMedicamento(index: number, event: Event): void {

    const id = Number((event.target as HTMLSelectElement).value);

    this.modelo.update(datos => ({
      ...datos,
      detalles: datos.detalles.map((detalle, i) =>
        i === index ? { ...detalle, id_medicamento: id } : detalle
      )
    }));
  }

  agregarDetalle(): void {

    this.modelo.update(datos => ({
      ...datos,
      detalles: [
        ...datos.detalles,
        {
          dosis: '',
          frecuencia: '',
          cantidad: 1,
          id_medicamento: 0
        }
      ]
    }));

  }

  eliminarDetalle(index: number): void {

    if (this.modelo().detalles.length > 1) {

      this.modelo.update(datos => ({
        ...datos,
        detalles: datos.detalles.filter((_, i) => i !== index)
      }));

    }

  }

  guardar(event: Event): void {

    event.preventDefault();

    if (this.formulario().invalid()) {
      this.formulario().markAsTouched();
      return;
    }

    const receta: RecetaNueva = this.modelo();

    this.cargando.set(true);
    this.error.set('');

    this.recetasService.guardarReceta(receta).subscribe({

      next: () => {
        this.cargando.set(false);
        this.router.navigate([this.base, 'recetas']);
      },

      error: (err) => {
        console.error('Error al guardar receta', err);
        this.error.set('No se pudo guardar la receta.');
        this.cargando.set(false);
      }

    });

  }

  cancelar(): void {
    this.router.navigate([this.base, 'recetas']);
  }

}
