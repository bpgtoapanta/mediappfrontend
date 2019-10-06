import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SignoVital } from '../_model/signoVital';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {

  signoCambio = new Subject<SignoVital[]>();
  mensajeCambio = new Subject<string>();
  url = `${environment.HOST}/signos`;

  constructor(private http: HttpClient) { }

  listarSignos() {
    return this.http.get<SignoVital[]>(this.url);
  }

  listarPorId(idSigno: number) {
    return this.http.get<SignoVital>(`${this.url}/${idSigno}`);
  }

  registrar(signoVital: SignoVital) {
    return this.http.post(this.url, signoVital);
  }

  modificar(signoVital: SignoVital) {
    return this.http.put(this.url, signoVital);
  }

  eliminar(idSigno: number) {
    return this.http.delete(`${this.url}/${idSigno}`);
  }
}
