import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts.js';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  transformador: any[] = [];
  listOfDisplayData: any[] = [];
  loading = true;
  pageIndex: number = 1;
  pageSize: number = 7;

  // Variables para filtros por cada columna
  filterSubestacion = '';
  filterUbicacion = '';
  filterTransformador = '';
  filterTipo = '';
  filterMarca = '';
  filterVoltage = '';
  filterPotencia = '';

  constructor(
    private PM1Service: PM1Service,
    private router: Router,
    private transformadorService: TransformadorPM1Service
  ) {}

  ngOnInit(): void {
    this.transformadorService.getTransformadores().subscribe((data) => {
      this.transformador = data;
      this.listOfDisplayData = [...this.transformador]; // Inicializamos la tabla con los datos
      this.loading = false;
    });
  }

  abrirpruebas(transformador: string, subestacion: string, voltage: string, potencia: string): void {
    this.router.navigate(['transformadores/inseccion-pm1'], {
      queryParams: {
        transformador: transformador,
        subestacion: subestacion,
        voltage: voltage,
        potencia: potencia,
      },
    });
  }

  // Método para aplicar todos los filtros
  applyFilters(): void {
    this.listOfDisplayData = this.transformador.filter((item) => {
      return (
        item.subestacion.toLowerCase().includes(this.filterSubestacion.toLowerCase()) &&
        item.ubicacion.toLowerCase().includes(this.filterUbicacion.toLowerCase()) &&
        item.transformador.toLowerCase().includes(this.filterTransformador.toLowerCase()) &&
        item.tipo.toLowerCase().includes(this.filterTipo.toLowerCase()) &&
        item.marca.toLowerCase().includes(this.filterMarca.toLowerCase()) &&
        item.voltage.toString().includes(this.filterVoltage) &&
        item.potencia.toString().includes(this.filterPotencia)
      );
    });
  }
  onPageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
  }


}
