import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Mensaje } from '../models/mensaje.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  /* Para Interactuar Con La Collection */
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  /* Para Mostrar Los Mensajes En Un Arreglo */
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(
    private afs: AngularFirestore,
    private authenticate: AngularFireAuth
  ) {
    this.authenticate.authState.subscribe((user) => {
      console.log('Estado Del Usuario: ', user);

      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    if (proveedor === 'google' || proveedor === 'Google') {
      this.authenticate.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      this.authenticate.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }

  logout() {
    this.usuario = {};
    this.authenticate.signOut();
  }

  /* Mostrar Mensajes Del Chat En El Frontend */
  obtenerMensajesDeLaCollection() {
    /* Aqui Estoy Aplicando Querys A Firebase */
    this.itemsCollection = this.afs.collection<Mensaje>('chats', (ref) =>
      ref.orderBy('fecha', 'desc').limit(5)
    );

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        // console.log(mensajes);

        /* Para Que los mensajes aparescan en un orden correcto */
        this.chats = [];
        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;
      })
    );
  }

  /* Guardar Los Mensajes Del Frontend A Firebaser */
  agregarMensaje(texto: string) {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
    };

    /* Agregar Objeto Mensaje A Firebase */
    /* Firestore Retorna Una Promesa Que Puedo Ejecutar En Otro Lado */
    return this.itemsCollection.add(mensaje);
  }
}
