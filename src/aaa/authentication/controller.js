import loginHandler from './handler';

export function loginWithPassword(req, res, next) {
  loginHandler.loginWithPassword(req, res, next);
}