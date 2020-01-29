export const environment = {
  production: true,
  PAGESIZE:20,
  APP_NAME:'PLK',
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
    INACTIVE_LOGOUT_SUCCESS:'Session has been timed out due to inactivity. Please login again.'
  }
};
