import { Component, inject, signal } from '@angular/core';
import { Medicamento, MedicamentoNuevo } from '../Model/Medicamento';
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

  borrarMedicamento(id: number){
    this.mensajeError.set(null);
    this.mService.borrarMedicamento(id).subscribe({
      next: ()=>{
      this.cargarMedicamentos();
      },
      error: (e)=>{
        console.error('Error al eliminar el medicamento: ', e);
        this.mensajeError.set(
          e.error?.mensaje ?? e.error?.message ?? 'No se pudo eliminar el medicamento.'
        );
      }
    })
  }

}
