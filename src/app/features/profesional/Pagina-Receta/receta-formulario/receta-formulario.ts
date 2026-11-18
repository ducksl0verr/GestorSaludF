import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FormField, form, required, min, applyEach, disabled } from '@angular/forms/signals';

import { RecetaService } from '../services/receta-services';
import { RecetaNueva } from '../model/receta';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';
import { MedicamentoService } from '../../../public/Pagina-Medicamento/Service/medicamento-service';
import { Medicamento } from '../../../public/Pagina-Medicamento/Model/Medicamento';
import { PacienteService } from '../../../administrativo/Pagina-Paciente/services/paciente-service';
import { UsuarioService } from '../../../admin/Pagina-Usuarios/service/usuario-service';

@Component({
  selector: 'app-receta-form',
  imports: [FormField, RouterModule, CommonModule],
  templateUrl: './receta-formulario.html',
  styleUrl: './receta-formulario.css'
})
export class RecetaFormulario implements OnInit {

  private recetasService = inject(RecetaService);
  private medicamentoService = inject(MedicamentoService);
  private pacienteService = inject(PacienteService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  private base = this.route.snapshot.data['base'];

  cargando = signal(false);
  error = signal('');
  pacientePrecargado = signal(false);
  idPaciente = signal<number | null>(null);
  idProfesional = signal<number | null>(null);
  nombrePaciente = signal('');
  nombreProfesional = signal('');

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

    // Ambos IDs se completan automáticamente: no se pueden editar a mano.
    disabled(schema.id_paciente, { when: () => this.pacientePrecargado() });
    disabled(schema.id_profesional, { when: () => !!this.idProfesional() });

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
      this.idPaciente.set(paciente);
      this.pacientePrecargado.set(true);
    }

    if (profesional) {
      this.idProfesional.set(profesional);
    }

    this.modelo.update(datos => ({
      ...datos,
      id_paciente: this.idPaciente() ?? datos.id_paciente,
      id_profesional: this.idProfesional() ?? datos.id_profesional
    }));

    this.cargarNombres();
    this.cargarMedicamentos();
  }

  private cargarNombres(): void {
    const idPaciente = this.idPaciente();

    if (idPaciente) {
      this.pacienteService.getPaciente(idPaciente).subscribe({
        next: (p) => this.nombrePaciente.set(`${p.nombre} ${p.apellido}`.trim()),
        error: () => this.nombrePaciente.set(`Paciente #${idPaciente}`)
      });
    }

    const idProfesional = this.idProfesional();

    if (idProfesional) {
      // El nombre viene del endpoint de profesionales (VER_PROFESIONAL);
      // si solo se dio VER_USUARIO, se usa el endpoint general.
      this.usuarioService.getProfesional(idProfesional).subscribe({
        next: (u) => this.nombreProfesional.set(`${u.nombre} ${u.apellido}`.trim()),
        error: () => this.usuarioService.getUsuario(idProfesional).subscribe({
          next: (u) => this.nombreProfesional.set(`${u.nombre} ${u.apellido}`.trim()),
          error: () => this.nombreProfesional.set(`Profesional #${idProfesional}`)
        })
      });
    }
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
        this.volver();
      },

      error: (err) => {
        console.error('Error al guardar receta', err);
        this.error.set('No se pudo guardar la receta.');
        this.cargando.set(false);
      }

    });

  }

  cancelar(): void {
    this.volver();
  }

  private volver(): void {
    const paciente = this.idPaciente();

    this.router.navigate(
      [this.base, 'recetas'],
      paciente ? { queryParams: { paciente } } : {}
    );
  }

}
