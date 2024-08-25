import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
let HeaderComponent = class HeaderComponent {
    drawerInfo = {
        content: {
            header: true // Puedes ajustar esto según tu lógica
        }
    };
    noticeList = [
        {
            type: 'notice',
            time: '2 hours ago',
            avatar: 'path/to/avatar.png',
            desc: 'You have a new notice',
            read: false,
            title: 'New Notice'
        },
        {
            type: 'notice',
            time: '1 day ago',
            avatar: 'path/to/avatar2.png',
            desc: 'Your notice has been updated',
            read: true,
            title: 'Updated Notice'
        }
    ];
    messageList = [
        {
            type: 'message',
            time: '3 hours ago',
            avatar: 'path/to/avatar3.png',
            desc: 'You have a new message',
            read: false,
            title: 'New Message'
        }
    ];
    taskList = [
        {
            type: 'task',
            time: '5 hours ago',
            avatar: 'path/to/avatar4.png',
            desc: 'A new task has been assigned',
            read: false,
            title: 'New Task'
        }
    ];
    navigationInfo = {
        header: true // o false dependiendo de tu lógica
    };
    siteStyle = 'dark'; // o 'light' dependiendo de tu lógica
    isCollapsed = false; // o true dependiendo de tu lógica
    bellInfo = {
        total: 5, // ejemplo de conteo de notificaciones
        notice: 2, // ejemplo de notificaciones
        message: 3, // ejemplo de mensajes
        task: 1 // ejemplo de tareas
    };
    // Métodos de ejemplo
    read(item) {
        // Implementa tu lógica aquí
    }
    readAll(type) {
        // Implementa tu lógica aquí
    }
    readMore(type) {
        // Implementa tu lógica aquí
    }
    goUrl(url) {
        // Implementa tu lógica aquí
    }
    // Ejemplo de menú de lenguaje (ng-zorro dropdown)
    menuLanguage = null; // Esto debería ser una referencia a un menú drop
};
HeaderComponent = __decorate([
    Component({
        selector: 'app-header',
        standalone: true,
        imports: [SharedModule
        ],
        templateUrl: './header.component.html',
        styleUrl: './header.component.css'
    })
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map