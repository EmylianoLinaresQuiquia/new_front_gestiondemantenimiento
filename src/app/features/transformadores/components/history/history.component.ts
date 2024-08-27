import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spt1Service } from 'src/app/features/sistemas/services/spt1.service';
import { Spt1 } from 'src/app/features/sistemas/interface/spt1';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  constructor(private spt1Service: Spt1Service) {} // Inyección de dependencias

  ngOnInit(): void {
    this.spt1Service.mostrarTodosSpt1().subscribe(
      (data: Spt1[]) => {
        console.log("spt1 metodo mostrar todos", data);
      }
    );
  }
}
