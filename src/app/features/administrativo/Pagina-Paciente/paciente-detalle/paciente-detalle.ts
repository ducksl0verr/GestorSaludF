import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Paciente } from '../models/paciente';
import { PacienteService } from '../services/paciente-service';
import { Obra_Social } from '../../../public/Pagina-ObraSocial/Model/Obra_Social';
import { ObraSocialService } from '../../../public/Pagina-ObraSocial/Service/obra-social-service';
import { HistoriaClinicaService } from '../../../profesional/Pagina-HistoriaClinica/services/historia-clinica-services';
import { mensajeDeError } from '../../../../core/utils/mensaje-error';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-paciente-detalle',
  styleUrl: './paciente-detalle.css',
  templateUrl: './paciente-detalle.html',
})
export class PacienteDetalle implements OnInit {

    paciente = signal<Paciente | undefined>(undefined);
    obraSocial = signal<Obra_Social | undefined>(undefined);
    esSinObraSocial = computed(() =>
        (this.paciente()?.nombreObraSocial ?? '').trim().toLowerCase() === 'sin obra social'
    );
    abriendoHistoria = signal(false);
    historiaNoEncontrada = signal(false);
    errorHistoria = signal('');
    error = signal('');
    private route = inject(ActivatedRoute);
    private auth = inject(AuthService);
    private historiaClinicaService = inject(HistoriaClinicaService);
    protected base = this.route.snapshot.data['base'];
    protected esVistaProfesional = this.base === '/profesional';
    protected puedeEditar = this.auth.tienePermiso('EDITAR_PACIENTE');
    protected puedeEliminar = this.auth.tienePermiso('ELIMINAR_PACIENTE');

constructor(private pacienteService: PacienteService, private router: Router,private obraSocialService: ObraSocialService,) {}

ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pacienteService.getPaciente(id).subscribe({
        next: (paciente) => {
            this.paciente.set(paciente);

            if (!this.esSinObraSocial() && paciente.id_obraSocial != null) {
                this.obraSocialService.getObraSocial(paciente.id_obraSocial).subscribe({
                    next: (obraSocial) => {
                        this.obraSocial.set(obraSocial);
                    },
                    error: (error) => console.error('Error al obtener la obra social', error)
                });
            }
        },
        error: (error) => {
            console.error('Error al obtener el paciente', error);
            this.error.set(mensajeDeError(error, 'No se pudo cargar el paciente.'));
        }
    });
}


abrirHistoriaClinica(p: Paciente): void {
    if (this.abriendoHistoria()) return;

    this.abriendoHistoria.set(true);
    this.historiaNoEncontrada.set(false);
    this.errorHistoria.set('');

    this.historiaClinicaService.getHistoriasClinicas().subscribe({
        next: (historias) => {
            this.abriendoHistoria.set(false);

            const historia = historias.find(h => h.id_paciente === p.id);

            if (historia) {
                this.router.navigate([this.base, 'historiasclinicas', historia.id]);
            } else {
                this.historiaNoEncontrada.set(true);
            }
        },
        error: () => {
            this.abriendoHistoria.set(false);
            this.errorHistoria.set(
                'No se pudo consultar la historia clínica del paciente.'
            );
        }
    });
}

crearHistoriaClinica(p: Paciente): void {
    this.historiaNoEncontrada.set(false);

    this.router.navigate(
        [this.base, 'historiasclinicas', 'nuevo'],
        { queryParams: { paciente: p.id } }
    );
}

cerrarAvisoHistoria(): void {
    this.historiaNoEncontrada.set(false);
}


eliminar(p: Paciente): void {
    if (!confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`)) return;

    this.pacienteService.borrarPaciente(p.id).subscribe({
      next: () => this.router.navigate([this.base, 'pacientes']),
      error: (error) => {
        console.error('No se pudo eliminar el paciente.', error);
        alert(mensajeDeError(error, 'No se pudo eliminar el paciente.'));
      },
    });
  }


}
