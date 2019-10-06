import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SignoVital } from 'src/app/_model/signoVital';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  displayedColumns = ['id', 'fecha', 'temperatura', 'ritmoRespiratorio', 'pulso', 'acciones'];
  dataSource: MatTableDataSource<SignoVital>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  mensaje: string;

  constructor(private signoService: SignosVitalesService, public snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit() {

    this.signoService.signoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signoService.listarSignos().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });
  }

  eliminar(idSigno: number) {
    this.signoService.eliminar(idSigno).pipe(switchMap(() => {
      return this.signoService.listarSignos();
    })).subscribe(data => {
      this.signoService.signoCambio.next(data);
      this.signoService.mensajeCambio.next('Se eliminó');
    });

  }

}
