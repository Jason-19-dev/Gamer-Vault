import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NativeBiometric } from 'capacitor-native-biometric';
@Injectable({
  providedIn: 'root'
})
export class BiometricService {

  constructor(private router: Router) { }

  async verifyIdentity(title: string, subtitle?: string): Promise<boolean> {
    try {
      const isAvailable = await NativeBiometric.isAvailable();
  
      if (isAvailable) {
        try {
          await NativeBiometric.verifyIdentity({
            reason: 'Validar identidad',
            title: title,
            subtitle: subtitle,
            description: 'Pon tu huella en el lector para validar tu identidad',
            maxAttempts: 2,
            useFallback: true,
          });
          return true; // Autenticación exitosa
        } catch (error) {
          console.error('Error during biometric verification:', error);
          return false; // Autenticación fallida
        }
      } else {
        return false; // Biometría no disponible
      }
    } catch (e) {
      console.error('Error checking biometric availability:', e);
      alert('Authentication failed');
      return false; // Error al verificar disponibilidad
    }
  }



}
