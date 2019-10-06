import { Component, OnInit, Inject } from '@angular/core';
import { Rol } from 'src/app/_model/rol';
import { Usuario } from 'src/app/_model/usuario';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nombreUsuario: string;
  usuario: Usuario;
  constructor(private dialogRef: MatDialogRef<PerfilComponent>, @Inject(MAT_DIALOG_DATA) public data: Usuario) { }

  ngOnInit() {
    this.usuario = new Usuario();
    this.usuario.nombre = this.data.nombre;
    this.usuario.roles = this.data.roles;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
