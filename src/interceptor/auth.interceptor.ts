import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const storageService = inject(StorageService);

   return from(storageService.getJwt()).pipe(
    switchMap(jwt => {
      if (jwt) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`, 
          },
        });
      } 
      return next(req);
    })
  );
};
