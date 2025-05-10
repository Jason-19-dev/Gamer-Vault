import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { StorageService } from 'src/services/storage/storage.service';

export const authGuard: CanActivateFn = (route, state): any => {

  const authService = inject(AuthService);
  inject(StorageService).getJwt()
  const router = inject(Router);
  



};