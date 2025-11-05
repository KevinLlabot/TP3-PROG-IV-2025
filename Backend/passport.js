import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';



export const configurePassport = () => {

const opts = {

jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (payload, done) => {

try {


return done(null, payload); 

} catch (err) 
{
return done(err, false);
}
}));
return passport;
};
