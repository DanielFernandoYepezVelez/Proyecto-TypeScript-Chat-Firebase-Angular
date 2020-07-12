import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  mensaje: string;
  elemento: HTMLElement;

  constructor(public chatService: ChatService) {
    this.chatService.obtenerMensajesDeLaCollection().subscribe(() => {
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
    });
  }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviar_mensaje() {
    // console.log(this.mensaje);
    if (this.mensaje.length === 0) {
      return;
    }

    this.chatService
      .agregarMensaje(this.mensaje)
      .then(() => {
        console.log('Mensaje Enviado');
        this.mensaje = '';
      })
      .catch((err) => console.error('Error Al Guardar', err));
  }
}
