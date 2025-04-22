import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class HttpheaderService {

  constructor(private storage: Storage) { }

  async getJsonHeaders(): Promise<HttpHeaders> {
    const token = await this.storage.get('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Autorization', `Bearer ${token}`);
    }

    return headers;
  }
}
