import { Joi, celebrate } from "celebrate";
import { cl_LoginRequest, sv_LoginResponseOK, sv_ServerInfo } from "../../../../protocol";
import { CfgServer } from "../../config/default/cfg_server";
import { ExpressRoute } from "./route";

export class RouteLogin extends ExpressRoute {

    register() {
        const serverConfig = this._configManager.getConfig(CfgServer);
        this.router.post('/login', celebrate({
            body: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().allow('')
            }).required()
        }), (req, res) => {

            const request = req.body as cl_LoginRequest;
            if (serverConfig.password !== "" && request.password !== serverConfig.password) {
                return res.sendStatus(403);
            }

            res.status(200).json(<sv_LoginResponseOK> {
                token: "test token"
            });
        });
    }
}