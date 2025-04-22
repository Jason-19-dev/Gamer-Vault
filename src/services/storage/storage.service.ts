import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageReady = false;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this.storageReady = true;
  }

  // Método para guardar el JWT
  public async setJwt(token: string): Promise<void> {
    if (!this.storageReady) {
      await this.init();
    }
    await this.storage.set('jwt', token);
  }

  // Método para obtener el JWT
  public async getJwt(): Promise<string | null> {
    if (!this.storageReady) {
      await this.init();
    }
    return await this.storage.get('jwt');
  }

  // Método para eliminar el JWT
  public async removeJwt(): Promise<void> {
    if (!this.storageReady) {
      await this.init();
    }
    await this.storage.remove('jwt');
  }
}
