"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonRoutesConfig = /** @class */ (function () {
    function CommonRoutesConfig(app, name) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }
    CommonRoutesConfig.prototype.getName = function () {
        return this.name;
    };
    return CommonRoutesConfig;
}());
exports.default = CommonRoutesConfig;
