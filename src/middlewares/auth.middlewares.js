

const auth = (req, res, next) => {
    if (req.session?.user) {
      return next();
    } else {
      res.redirect("/login")
    }
  };
  const isAdmin = (req, res, next) => {

    if (req.session.user && req.session.user._doc.role == 'ADMIN') {
      next();
    } else {
        // El usuario no tiene permisos de administrador, responde con un acceso no autorizado
        res.status(403).json({ message: 'Acceso no autorizadoo.'});
    }
};
  export {auth,isAdmin} 