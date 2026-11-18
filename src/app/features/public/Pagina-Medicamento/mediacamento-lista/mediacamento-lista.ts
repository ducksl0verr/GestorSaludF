import { Component, computed, inject, signal } from '@angular/core';
import { Medicamento } from '../Model/Medicamento';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicamentoService } from '../Service/medicamento-service';


@Component({
  imports: [RouterLink],
  selector: 'app-mediacamento-lista',
  styleUrl: './mediacamento-lista.css',
  templateUrl: './mediacamento-lista.html',
})
export class MediacamentoLista {

  medicamentos = signal<Medicamento[]>([]);
  busqueda = signal('');

  medicamentosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) return this.medicamentos();

    return this.medicamentos().filter(med =>
      med.nombre.toLowerCase().includes(texto)
    );
  });

  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];

  constructor(
    private mService: MedicamentoService
  ){}

  ngOnInit(){
    this.cargarMedicamentos();
  }

  cargarMedicamentos(){
    this.mService.getMedicamentos().subscribe(
      data=>{
        console.log(data);
        this.medicamentos.set(data);
      }
    )
  }

  protected mensajeError = signal<string | null> (null);

  onBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  darDeBaja(id: number): void {
    if (!confirm('¿Dar de baja este medicamento?')) return;

    this.mensajeError.set(null);
    this.mService.darDeBajaMedicamento(id).subscribe({
      next: ()=>{
        this.cargarMedicamentos();
      },
      error: (e)=>{
        console.error('Error al dar de baja el medicamento: ', e);
        this.mensajeError.set(
          e.error?.mensaje ?? e.error?.message ?? 'No se pudo dar de baja el medicamento.'
        );
      }
    })
  }

}
