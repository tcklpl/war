import { type cl_LoginRequest, type sv_LoginResponseOK } from ':protocol';
import { Joi, celebrate } from 'celebrate';
import { CfgServer } from '../../config/default/cfg_server';
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
                    return res.sendStatus(403);
                }

                // validate username
                if (!this._gameServer.playerManager.isUsernameAvailable(request.username)) {
                    return res.sendStatus(409);
                }

                // all ok, signing token
                const token = this._cryptManager.signTokenBody({
                    username: request.username,
                    ip: req.ip,
                });

                return res.status(200).json(<sv_LoginResponseOK>{
                    token,
                });
            },
        );
    }
}
