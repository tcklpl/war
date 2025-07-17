import type { cl_LoginRequest, sv_LoginResponseOK } from ':protocol';
import { celebrate, Joi } from 'celebrate';
import { CfgServer } from '../../config/default/cfg-server';
import { ExpressRoute } from './route';

export class RouteLogin extends ExpressRoute {
	register() {
		const serverConfig = this._configManager.getConfig(CfgServer);
		this.router.post(
			'/login',
			celebrate({
				body: Joi.object({
					username: Joi.string().required(),
					password: Joi.string().allow(''),
				}).required(),
			}),
			(req, res) => {
				// validate password
				const request = req.body as cl_LoginRequest;
				if (serverConfig.password !== '' && request.password !== serverConfig.password) {
					res.sendStatus(403);
					return;
				}

				// validate username
				if (!this._gameServer.playerManager.isUsernameAvailable(request.username)) {
					res.sendStatus(409);
					return;
				}

				// all ok, signing token
				const token = this._cryptManager.signTokenBody({
					username: request.username,
					ip: req.ip,
				});

				res.status(200).json(<sv_LoginResponseOK>{
					token,
				});
			},
		);
	}
}
