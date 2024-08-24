import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {
    this.initializeDialog();
  }

  initializeDialog(): void {
    $(document).ready(() => {
      $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        position: { my: 'right top', at: 'right+0 top+10%', of: window },
        create: function () {
          $(this).closest(".ui-dialog").find(".ui-dialog-titlebar").hide();
        }
      });
      
    });
  }

  showAlert(message: string, type: 'success' | 'error' | 'preparation'): void {
    let progressBarColor;
    switch (type) {
      case 'success':
        progressBarColor = 'green';
        break;
      case 'error':
        progressBarColor = 'red';
        break;
      case 'preparation':
        progressBarColor = 'blue';
        break;
      default:
        progressBarColor = 'red';
    }

    $('#dialog').html(`
      <div style="position: relative;">
        <div id="progress-bar" style="height: 5px; background: ${progressBarColor}; width: 100%; position: absolute; top: 0; left: 0;"></div>
        <div style="padding-top: 10px;">${message}</div>
      </div>
    `);
    $('#dialog').dialog('open');

    // Cerrar el diálogo después de 5 segundos y actualizar la barra de progreso
    let duration = 5000;
    let interval = 100;
    let width = 100;
    const progressBar = $('#progress-bar');

    const timer = setInterval(() => {
      width -= (interval / duration) * 100;
      progressBar.css('width', width + '%');
      if (width <= 0) {
        clearInterval(timer);
        $('#dialog').dialog('close');
      }
    }, interval);
  }

  showConfirmDialog(message: string, onConfirm: () => void, onCancel: () => void): void {
    $('#dialog').html(`
      <div>${message}</div>
      <div style="text-align: center; margin-top: 10px;">
        <button id="confirmButton" class="ui-button ui-corner-all ui-widget">Sí</button>
        <button id="cancelButton" class="ui-button ui-corner-all ui-widget">No</button>
      </div>
    `);

    $('#dialog').dialog('open');

    $('#confirmButton').on('click', () => {
      $('#dialog').dialog('close');
      onConfirm();
    });

    $('#cancelButton').on('click', () => {
      $('#dialog').dialog('close');
      onCancel();
    });
  }
}
