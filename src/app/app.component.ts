import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';
import { LoginService } from './_service/login.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from './_model/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus: Menu[] = [];
  usuario: Usuario;

  constructor(public loginService: LoginService, private menuService: MenuService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
    });
  }

  openDialog(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuario = new Usuario();
    this.usuario.nombre = decodedToken.user_name;
    this.usuario.roles = decodedToken.authorities;
    const dialogRef = this.dialog.open(PerfilComponent, {
      width: '300px',
      data: { nombre: this.usuario.nombre, roles: this.usuario.roles }
    });
  }

}
