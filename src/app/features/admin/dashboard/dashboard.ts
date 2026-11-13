import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Gasto } from '../../administrativo/Pagina-Gasto/models/gasto';
import { GastoService } from '../../administrativo/Pagina-Gasto/services/gasto-service';
import { Pago } from '../../administrativo/Pagina-Pago/models/pago';
import { PagoService } from '../../administrativo/Pagina-Pago/services/pago-service';

interface ResumenMes {
  mes: number;
  nombre: string;
  pagos: number;
  gastos: number;
  alturaPagos: number;
  alturaGastos: number;
}

interface DiaCalendario {
  key: string;
  vacio: boolean;
  dia: number;
  pagos: number;
  gastos: number;
  total: number;
  esHoy: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private pagoService = inject(PagoService);
  private gastoService = inject(GastoService);

  private readonly hoy = new Date();
  private readonly nombresMeses = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  private readonly formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  readonly diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  pagos = signal<Pago[]>([]);
  gastos = signal<Gasto[]>([]);
  cargando = signal(true);
  mesSeleccionado = signal(this.claveMes(this.hoy));

  periodo = computed(() => {
    const [anio, mes] = this.mesSeleccionado().split('-').map(Number);
    return { anio, mes };
  });

  nombreMes = computed(() => {
    const { anio, mes } = this.periodo();
    const nombre = new Intl.DateTimeFormat('es-AR', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(anio, mes - 1, 1));

    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  });

  pagosMes = computed(() =>
    this.pagos().filter((pago) =>
      this.claveFecha(pago.fecha).startsWith(this.mesSeleccionado())
    )
  );

  gastosMes = computed(() =>
    this.gastos().filter((gasto) =>
      this.claveFecha(gasto.fecha).startsWith(this.mesSeleccionado())
    )
  );

  totalPagosMes = computed(() =>
    this.pagosMes().reduce((total, pago) => total + (Number(pago.monto) || 0), 0)
  );

  totalGastosMes = computed(() =>
    this.gastosMes().reduce((total, gasto) => total + (Number(gasto.monto) || 0), 0)
  );

  balanceMes = computed(() => this.totalPagosMes() - this.totalGastosMes());

  totalMovimientosMes = computed(
    () => this.pagosMes().length + this.gastosMes().length
  );

  porcentajePagos = computed(() => {
    const total = this.totalMovimientosMes();

    return total === 0 ? 0 : Math.round((this.pagosMes().length / total) * 100);
  });

  estiloDona = computed(() => {
    if (this.totalMovimientosMes() === 0) {
      return 'conic-gradient(#D9E4E1 0 100%)';
    }

    const porcentaje = this.porcentajePagos();

    return `conic-gradient(var(--od-teal) 0 ${porcentaje}%, var(--od-orange) ${porcentaje}% 100%)`;
  });

  porMes = computed<ResumenMes[]>(() => {
    const anio = this.periodo().anio;
    const conteo = new Map<number, { pagos: number; gastos: number }>();

    for (let mes = 1; mes <= 12; mes++) {
      conteo.set(mes, { pagos: 0, gastos: 0 });
    }

    this.pagos().forEach((pago) => {
      const partes = this.partesFecha(pago.fecha);

      if (partes?.anio === anio) {
        const item = conteo.get(partes.mes);
        if (item) item.pagos++;
      }
    });

    this.gastos().forEach((gasto) => {
      const partes = this.partesFecha(gasto.fecha);

      if (partes?.anio === anio) {
        const item = conteo.get(partes.mes);
        if (item) item.gastos++;
      }
    });

    const filas = this.nombresMeses.map((nombre, indice) => {
      const item = conteo.get(indice + 1) ?? { pagos: 0, gastos: 0 };

      return {
        mes: indice + 1,
        nombre,
        pagos: item.pagos,
        gastos: item.gastos,
      };
    });

    const maximo = Math.max(
      1,
      ...filas.map((fila) => Math.max(fila.pagos, fila.gastos))
    );

    return filas.map((fila) => ({
      ...fila,
      alturaPagos: (fila.pagos / maximo) * 100,
      alturaGastos: (fila.gastos / maximo) * 100,
    }));
  });

  calendario = computed<DiaCalendario[]>(() => {
    const { anio, mes } = this.periodo();
    const primerDia = new Date(anio, mes - 1, 1);
    const desplazamiento = (primerDia.getDay() + 6) % 7;
    const totalDias = new Date(anio, mes, 0).getDate();
    const hoyKey = this.claveFecha(this.hoy);
    const celdas: DiaCalendario[] = [];

    for (let indice = 0; indice < desplazamiento; indice++) {
      celdas.push({
        key: `vacio-${indice}`,
        vacio: true,
        dia: 0,
        pagos: 0,
        gastos: 0,
        total: 0,
        esHoy: false,
      });
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const key = `${this.claveMes(primerDia)}-${String(dia).padStart(2, '0')}`;
      const pagos = this.pagos().filter(
        (pago) => this.claveFecha(pago.fecha) === key
      ).length;
      const gastos = this.gastos().filter(
        (gasto) => this.claveFecha(gasto.fecha) === key
      ).length;

      celdas.push({
        key,
        vacio: false,
        dia,
        pagos,
        gastos,
        total: pagos + gastos,
        esHoy: key === hoyKey,
      });
    }

    return celdas;
  });

  diasConMovimiento = computed(
    () => this.calendario().filter((dia) => !dia.vacio && dia.total > 0).length
  );

  sinRegistros = computed(
    () => this.pagos().length === 0 && this.gastos().length === 0
  );

  ngOnInit(): void {
    forkJoin({
      pagos: this.pagoService
        .getPagos()
        .pipe(catchError(() => of([] as Pago[]))),
      gastos: this.gastoService
        .getGastos()
        .pipe(catchError(() => of([] as Gasto[]))),
    }).subscribe({
      next: ({ pagos, gastos }) => {
        this.pagos.set(pagos ?? []);
        this.gastos.set(gastos ?? []);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cambiarMes(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;

    if (/^\d{4}-\d{2}$/.test(valor)) {
      this.mesSeleccionado.set(valor);
    }
  }

  seleccionarMes(mes: number): void {
    this.mesSeleccionado.set(
      `${this.periodo().anio}-${String(mes).padStart(2, '0')}`
    );
  }

  irMes(desplazamiento: number): void {
    const { anio, mes } = this.periodo();
    const fecha = new Date(anio, mes - 1 + desplazamiento, 1);

    this.mesSeleccionado.set(this.claveMes(fecha));
  }

  formatearMonto(valor: number): string {
    return this.formatoMoneda.format(valor || 0);
  }

  private claveMes(fecha: Date): string {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
  }

  private claveFecha(fecha: string | Date | null | undefined): string {
    const partes = this.partesFecha(fecha);

    if (!partes) return '';

    return `${partes.anio}-${String(partes.mes).padStart(2, '0')}-${String(
      partes.dia
    ).padStart(2, '0')}`;
  }

  private partesFecha(
    fecha: string | Date | null | undefined
  ): { anio: number; mes: number; dia: number } | null {
    if (!fecha) return null;

    if (fecha instanceof Date) {
      if (Number.isNaN(fecha.getTime())) return null;

      return {
        anio: fecha.getFullYear(),
        mes: fecha.getMonth() + 1,
        dia: fecha.getDate(),
      };
    }

    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);

    if (coincidencia) {
      return {
        anio: Number(coincidencia[1]),
        mes: Number(coincidencia[2]),
        dia: Number(coincidencia[3]),
      };
    }

    const fechaParseada = new Date(fecha);

    if (Number.isNaN(fechaParseada.getTime())) return null;

    return {
      anio: fechaParseada.getFullYear(),
      mes: fechaParseada.getMonth() + 1,
      dia: fechaParseada.getDate(),
    };
  }
}
