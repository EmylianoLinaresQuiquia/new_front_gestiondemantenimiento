import { Component,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subestacion } from '../../interface/subestacion';
import { SubestacionService } from '../../services/subestacion.service';
import { Subscription } from 'rxjs';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NzCardModule } from 'ng-zorro-antd/card'
import { SharedModule } from 'src/app/shared/shared.module';
type Tipo = 'spt1' | 'spt2';
type Opcion = 'Protocolo' | 'Historico';

@Component({
  selector: 'app-inspection-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzCardModule, NzSelectModule, SharedModule],
  templateUrl: './inspection-page.component.html',
  styleUrl: './inspection-page.component.css'
})
export class InspectionPageComponent {
  tagSubestacion: string = '';
  subestaciones: Subestacion[] = [];
  tagsSubestaciones: string[] = [];
  selectedOptionSpt1!: Opcion;  // Nueva variable para SPT1
  selectedOptionSpt2!: Opcion;  // Nueva variable para SPT2
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private subestacionService: SubestacionService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.subestacionService.MostrarSubestaciones().subscribe(
        (data: Subestacion[]) => {
          this.subestaciones = data;
          this.tagsSubestaciones = data.map(subestacion => subestacion.tag_subestacion);
        },
        error => {
          console.error('Error al obtener subestaciones', error);
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buscarSubestacion(): void {
    console.log('Subestación seleccionada:', this.tagSubestacion);
  }

  seleccionarOpcion(tipo: Tipo, opcion: Opcion): void {
    console.log('Tipo seleccionado:', tipo);
    console.log('Opción seleccionada:', opcion);

    if (opcion === 'Historico') {
      this.navegarAHistorial(tipo);
      return;
    }

    const rutas: Record<Tipo, string> = {
      spt1: '/sistemas/spt1',
      spt2: '/sistemas/spt2',
    };

    const rutaSeleccionada = rutas[tipo];
    console.log('Ruta seleccionada:', rutaSeleccionada);

    if (!rutaSeleccionada) {
      console.error('Ruta no encontrada para el tipo:', tipo);
      return;
    }

    this.navegarARuta(rutaSeleccionada);
  }

  navegarAHistorial(tipo: Tipo): void {
    const rutasHistorial: Record<Tipo, string> = {
      spt1: '/sistemas/historial-spt1',
      spt2: '/sistemas/historial-spt2',
    };

    const rutaHistorial = rutasHistorial[tipo];
    console.log('Navegando a la ruta de historial:', rutaHistorial);
    this.router.navigate([rutaHistorial], {
      queryParams: {
        tag: this.tagSubestacion
      },
    });
  }

  navegarARuta(ruta: string): void {
    const subestacionSeleccionada = this.subestaciones.find(s => s.tag_subestacion === this.tagSubestacion);
    console.log('Subestación encontrada:', subestacionSeleccionada);

    if (subestacionSeleccionada) {
      this.router.navigate([ruta], {
        queryParams: {
          tag: subestacionSeleccionada.tag_subestacion,
          ubicacion: subestacionSeleccionada.ubicacion,
          plano: subestacionSeleccionada.plano,
          cantidad_spt: subestacionSeleccionada.cantidad_spt,
          id_subestacion: subestacionSeleccionada.id_subestacion,
          fecha_plano : subestacionSeleccionada.fecha_plano,
          versio:subestacionSeleccionada.versio
        },
      });
    } else {
      console.error('Subestación no encontrada para redirigir.');
    }
  }
}
