import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SignoVital } from 'src/app/_model/signoVital';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {

  form: FormGroup;

  pacientes: Paciente[] = [];

  myControlPaciente: FormControl = new FormControl();

  pacienteSeleccionado: Paciente;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  filteredOptions: Observable<any[]>;

  mensaje: string;

  signoEdicion: SignoVital;
  edicion = false;
  id: number;


  constructor(private signosService: SignosVitalesService, private route: ActivatedRoute, private router: Router,
    private pacienteService: PacienteService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      paciente: this.myControlPaciente,
      temperatura: new FormControl(0),
      fecha: new FormControl(new Date()),
      ritmoRespiratorio: new FormControl(''),
      pulso: new FormControl('')
    });
    this.listarPacientes();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.edicion = params['id'] != null;
      this.initForm();
    });

    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
  }

  initForm() {
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(data => {
        const id = data.idSigno;
        const temperatura = data.temperatura;
        const ritmoRespiratorio = data.ritmoRespiratorio;
        const pulso = data.pulso;
        const paciente = data.paciente;
        const fecha = data.fecha;

        this.form = new FormGroup({
          'idSigno': new FormControl(id),
          'temperatura': new FormControl(temperatura),
          'ritmoRespiratorio': new FormControl(ritmoRespiratorio),
          'pulso': new FormControl(pulso),
          'paciente': new FormControl(paciente),
          'fecha': new FormControl(new Date(fecha)),
        });
      });
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  aceptar() {
    const signoVitales = new SignoVital();
    signoVitales.paciente = this.form.value['paciente'];
    let fechaSeleccionada= new Date(this.form.value['fecha']);
    let localISOTime = new Date(fechaSeleccionada.getTime() - (fechaSeleccionada.getTimezoneOffset() * 60000)).toISOString();
    signoVitales.fecha = localISOTime;
    if (!!this.id) {
      signoVitales.idSigno = this.id;
    }
    signoVitales.temperatura = this.form.value['temperatura'];
    signoVitales.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    signoVitales.pulso = this.form.value['pulso'];

    this.signosService.registrar(signoVitales).subscribe(() => {
      this.signosService.listarSignos().subscribe(data => {
        this.signosService.signoCambio.next(data);
        this.snackBar.open('Se registró', 'Aviso', { duration: 2000 });
        this.router.navigate(['signos']);
      });
      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.pacienteSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}
