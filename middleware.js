export function AuthMiddleware(req, res, next){
    console.log('auth middleware called')
    next();
}
