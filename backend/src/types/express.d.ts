declare namespace Express {
  interface Request {
    user?: import('../users/user.entity').User;
  }
}
