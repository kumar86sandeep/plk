// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  PAGESIZE:20,
  APP_NAME:'PLK',
  //DB_CONNECTION_URL:'http://localhost:3000/api',
  DB_CONNECTION_URL:'http://52.52.35.177:3000/api/',
  PLKCONFIG:{
    URL:'http://fmsweb.aimatics.net/',
    TENANATID:'259e3ff0-11b4-11ea-8d71-362b9e155667',
    SECRETTOKEN:'SV49IHMIDJLKQ8KFCP1RBYPF'
  },
  MESSAGES:{
    CHEKING_AUTH:'Checking Authorization...',
    LOGOUT_IN_PROCESS:'Clearing user data for logout...',
    LOGOUT_SUCCESS:'Successfully logged out.',
    FETCHING_RECORDS:'Fetching Records....',
    ERROR_TEXT_LOADER:'Sorry!! We could not fetch records.',
    FETCHING_IMAGES:'Fetching Images',
    INACTIVE_LOGOUT_SUCCESS:'Session has been timed out due to inactivity. Please login again.',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
