"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt_simple_1 = __importDefault(require("jwt-simple"));
var common_routes_config_1 = __importDefault(require("../common/common.routes.config"));
var users_service_1 = __importDefault(require("./users.service"));
// import debug from 'debug';
// const debugLog: debug.IDebugger = debug('app');
var SUCCESS_CODE = 200;
var UsersRoutes = /** @class */ (function (_super) {
    __extends(UsersRoutes, _super);
    function UsersRoutes(app) {
        return _super.call(this, app, 'UsersRoutes') || this;
    }
    UsersRoutes.prototype.configureRoutes = function () {
        var _this = this;
        this.app.post('/users', function (_, res) { return __awaiter(_this, void 0, void 0, function () {
            var pdf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, users_service_1.default.generatePdf()];
                    case 1:
                        pdf = _a.sent();
                        res.status(SUCCESS_CODE).send(pdf);
                        return [2 /*return*/];
                }
            });
        }); });
        // Get Base64 of pdf (URL Safe)
        this.app.get('/get-encoded-pdf', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var pdf, encodedPdf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, users_service_1.default.retrievePdf()];
                    case 1:
                        pdf = _a.sent();
                        encodedPdf = encodeURIComponent(pdf);
                        res.status(SUCCESS_CODE).send(encodedPdf);
                        return [2 /*return*/];
                }
            });
        }); });
        // Render pdf from Base64 (URL Safe)
        this.app.get('/render-pdf/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var pdf;
            return __generator(this, function (_a) {
                pdf = Buffer.from(decodeURIComponent(req.params.id), 'base64');
                res.header('Content-type', 'application/pdf');
                res.status(SUCCESS_CODE).send(pdf);
                return [2 /*return*/];
            });
        }); });
        // Get jwt of pdf (Base64)
        this.app.get('/get-encoded-pdf-jwt', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var pdf, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, users_service_1.default.retrievePdf()];
                    case 1:
                        pdf = _a.sent();
                        token = jwt_simple_1.default.encode({ pdfFile: pdf }, 'advance');
                        res.status(SUCCESS_CODE).send(token);
                        return [2 /*return*/];
                }
            });
        }); });
        // Render pdf from jwt (Base64)
        this.app.get('/render-pdf-jwt/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var decoded, pdf;
            return __generator(this, function (_a) {
                decoded = jwt_simple_1.default.decode(req.params.id, 'advance');
                pdf = Buffer.from(decoded.pdfFile, 'base64');
                res.header('Content-type', 'application/pdf');
                res.send(pdf);
                return [2 /*return*/];
            });
        }); });
        // Get jwt of pdf params
        this.app.post('/get-token', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                token = jwt_simple_1.default.encode(req.body, 'advance');
                res.status(SUCCESS_CODE).send(token);
                return [2 /*return*/];
            });
        }); });
        // Render pdf from jwt
        this.app.get('/render-pdf-token/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var decoded, pdfFile, pdf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decoded = jwt_simple_1.default.decode(req.params.id, 'advance');
                        console.log(decoded);
                        return [4 /*yield*/, users_service_1.default.retrievePdf()];
                    case 1:
                        pdfFile = _a.sent();
                        pdf = Buffer.from(pdfFile, 'base64');
                        res.header('Content-type', 'application/pdf');
                        res.send(pdf);
                        return [2 /*return*/];
                }
            });
        }); });
        return this.app;
    };
    return UsersRoutes;
}(common_routes_config_1.default));
exports.default = UsersRoutes;
