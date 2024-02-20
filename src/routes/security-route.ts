import {Router} from "express";
import {refreshTokenValidator} from "../validators/refresh-token-validator";
import {isUserDeviceValidator} from "../validators/is-user-device-validator";
import {securityController} from "../composition-roots/security-composition";

export const securityRoute = Router();

securityRoute.get("/devices", refreshTokenValidator, securityController.getDevices.bind(securityController))
securityRoute.delete("/devices", refreshTokenValidator, securityController.removeDevicesExceptCurrent.bind(securityController))
securityRoute.delete("/devices/:deviceId", refreshTokenValidator, isUserDeviceValidator, securityController.removeDevice.bind(securityController))