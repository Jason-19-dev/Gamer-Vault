import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpheaderService {

  constructor(private storageSercice: StorageService) { }

  async getJsonHeaders(): Promise<HttpHeaders> {
    const token = await this.storageSercice.getJwt();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
