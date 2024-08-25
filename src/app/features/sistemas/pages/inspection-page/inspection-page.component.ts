import { Component,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import { Subestacion } from '../../interface/subestacion';
//import { SubestacionService } from '../../services/subestacion.service';
import { Subscription } from 'rxjs';


import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NzCardModule } from 'ng-zorro-antd/card'

type Tipo = 'spt1' | 'spt2';
type Opcion = 'Protocolo' | 'Historico';
@Component({
  selector: 'app-inspection-page',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule ,NzCardModule],
  templateUrl: './inspection-page.component.html',
  styleUrl: './inspection-page.component.css'
})
export class InspectionPageComponent {
  tagSubestacion: string = '';
    //subestaciones: Subestacion[] = [];
    tagsSubestaciones: string[] = [];


    /*private subscriptions = new Subscription();

    constructor(private router: Router,
      private subestacionService: SubestacionService) {

      }

    ngOnInit() {
      this.subestacionService.MostrarSubestaciones().subscribe((data: Subestacion[]) => {
        this.subestaciones = data;
        this.tagsSubestaciones = data.map(subestacion => subestacion.tag_subestacion);
      }, error => {
        console.error('Error al obtener subestaciones', error);
      });
    }

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }

    buscarSubestacion(): void {
      if (this.tagSubestacion === 'SPT1') {
        const subestacionSeleccionada = this.subestaciones.find(s => s.tag_subestacion === this.tagSubestacion);
        if (subestacionSeleccionada) {
          this.router.navigate(['/inicio/spt01'], {
            queryParams: {
              tag: subestacionSeleccionada.tag_subestacion,
              ubicacion: subestacionSeleccionada.ubicacion,
              plano: subestacionSeleccionada.plano,
              cantidad_spt: subestacionSeleccionada.cantidad_spt
            }
          });
        } else {
          console.error('Subestación no encontrada');
        }
      }
    }



    seleccionarOpcion(tipo: Tipo, evento: Event): void {
      const inputElement = evento.target as HTMLSelectElement;
      if (inputElement && inputElement.value) {
        const opcion: Opcion = inputElement.value as Opcion;

        const rutas: Record<Tipo, Record<Opcion, string>> = {
          'spt1': {
            'Protocolo': '/inicio/spt01',
            'Historico': '/inicio/tabla-historial-spt1'
          },
          'spt2': {
            'Protocolo': '/inicio/spt02',
            'Historico': '/inicio/tabla-historial-spt2'
          }
        };

        const rutaSeleccionada = rutas[tipo][opcion];

        if (opcion === 'Historico') {
          this.router.navigate([rutaSeleccionada]);
        } else {
          const subestacionSeleccionada = this.subestaciones.find(s => s.tag_subestacion === this.tagSubestacion);
          if (subestacionSeleccionada) {
            this.router.navigate([rutaSeleccionada], {
              queryParams: {
                tag: subestacionSeleccionada.tag_subestacion,
                ubicacion: subestacionSeleccionada.ubicacion,
                plano: subestacionSeleccionada.plano,
                cantidad_spt: subestacionSeleccionada.cantidad_spt
              }
            });
          } else {
            console.error('Subestación no encontrada para redirigir.');
          }
        }
      }
    }

    abrirspt1(){
      this.router.navigate(['/spt1'])
    }*/

  }
