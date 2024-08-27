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
  imports: [CommonModule,FormsModule,ReactiveFormsModule ,NzCardModule,NzSelectModule,SharedModule],
  templateUrl: './inspection-page.component.html',
  styleUrl: './inspection-page.component.css'
})
export class InspectionPageComponent {
  tagSubestacion: string = '';
  subestaciones: Subestacion[] = [];
  tagsSubestaciones: string[] = [];
  selectedoption!: Opcion;
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

    const rutas: Record<Tipo, Record<Opcion, string>> = {
      spt1: {
        Protocolo: '/sistemas/spt1',
        Historico: '/sistemas/historial-spt1',
      },
      spt2: {
        Protocolo: '/sistemas/spt2',
        Historico: '/sistemas/historial-spt2',
      },
    };

    const rutaSeleccionada = rutas[tipo][opcion];
    console.log('Ruta seleccionada:', rutaSeleccionada);

    if (!rutaSeleccionada) {
      console.error('Ruta no encontrada para la opción:', opcion);
      return;
    }

    const subestacionSeleccionada = this.subestaciones.find(s => s.tag_subestacion === this.tagSubestacion);
    console.log('Subestación encontrada:', subestacionSeleccionada);

    if (subestacionSeleccionada) {
      console.log('Navegando a:', rutaSeleccionada);
      this.router.navigate([rutaSeleccionada], {
        queryParams: {
          tag: subestacionSeleccionada.tag_subestacion,
          ubicacion: subestacionSeleccionada.ubicacion,
          plano: subestacionSeleccionada.plano,
          cantidad_spt: subestacionSeleccionada.cantidad_spt,
        },
      });
    } else {
      console.error('Subestación no encontrada para redirigir.');
    }
  }
}
