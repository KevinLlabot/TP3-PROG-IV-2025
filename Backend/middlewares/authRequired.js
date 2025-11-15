import passport from 'passport';

//middleware que verifica si el usuario está autenticado usando JWT
export const authRequired = passport.authenticate('jwt', { session: false });