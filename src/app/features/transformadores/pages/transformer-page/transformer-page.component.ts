import { SubestacionService } from 'src/app/features/sistemas/services/subestacion.service';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Subestacion } from 'src/app/features/sistemas/interface/subestacion';
import { Subscription } from 'rxjs';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NzCardModule } from 'ng-zorro-antd/card'
import { SharedModule } from 'src/app/shared/shared.module';


import { TransformadorPM1 } from 'src/app/features/sistemas/interface/transformador-pm1';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
@Component({
  selector: 'app-transformer-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './transformer-page.component.html',
  styleUrl: './transformer-page.component.css'
})
export class TransformerPageComponent {
  transformadores: { label: string, value: TransformadorPM1 }[] = [];
  selectedTransformador: TransformadorPM1 | null = null;
  private subscriptions = new Subscription();
  selectedSubestacion: string = '';
  error: string | null = null;
  transformadoresFiltrados: TransformadorPM1[] = [];
  selectedFiltradoTransformador: TransformadorPM1 | null = null;

  constructor(
    private router: Router,
    private transformadorService: TransformadorPM1Service
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.transformadorService.getTransformadores().subscribe((data: TransformadorPM1[]) => {
        // Crear un Set para almacenar valores únicos de subestación
        const subestacionesUnicas = new Set<string>();

        this.transformadores = data
          .filter(transformador => {
            if (!subestacionesUnicas.has(transformador.subestacion)) {
              subestacionesUnicas.add(transformador.subestacion);
              return true;
            }
            return false;
          })
          .map(transformador => ({
            label: transformador.subestacion,
            value: transformador
          }));
      })
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onTransformadorChange() {
    if (this.selectedTransformador) {
      this.selectedSubestacion = this.selectedTransformador.subestacion;
      console.log("selectedTransformador", this.selectedTransformador.subestacion);
      this.buscarTransformadoresPorSubestacion(this.selectedSubestacion);
    } else {
      console.log("selectedTransformador is null");
    }
  }

  buscarTransformadoresPorSubestacion(subestacion: string) {
    this.subscriptions.add(this.transformadorService.buscarTransformadoresporsubestacion(subestacion).subscribe({
      next: (data) => {
        this.transformadoresFiltrados = data;
      },
      error: (err) => {
        this.error = 'Error al buscar transformadores';
        console.error(err);
      }
    }));
  }

  buscarTransformador() {
    if (this.selectedFiltradoTransformador) {
      console.log("Enviando transformador filtrado:", this.selectedFiltradoTransformador);
      this.router.navigate(['transformadores/pm1'], { queryParams: { subestacion: this.selectedFiltradoTransformador.subestacion, transformador:
        this.selectedFiltradoTransformador.transformador,ubicacion:this.selectedFiltradoTransformador.ubicacion } });
    }
  }

  abrirtransformador() {
    this.router.navigate(['transformadores/transformador']);
  }

  abrirpruebas() {
    this.router.navigate(['transformadores/pruebas-pm1']);
  }

  abrirtabla() {
    this.router.navigate(['transformadores/historial-pm1']);
  }

  onFiltradoTransformadorChange() {
    if (this.selectedFiltradoTransformador) {
      console.log("selectedFiltradoTransformador", this.selectedFiltradoTransformador);
    } else {
      console.log("selectedFiltradoTransformador is null");
    }
  }
}
