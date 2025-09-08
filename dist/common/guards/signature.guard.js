"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureGuard = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
let SignatureGuard = class SignatureGuard {
    constructor(config) {
        this.config = config;
    }
    canActivate(context) {
        const enabled = this.config.get('VERIFY_SIGNATURE') ?? false;
        const appSecret = this.config.get('APP_SECRET');
        if (!enabled || !appSecret)
            return true;
        const req = context.switchToHttp().getRequest();
        const signature = req.header('X-Hub-Signature-256') || req.header('x-hub-signature-256');
        const rawBody = req.rawBody;
        if (!signature || !rawBody || !signature.startsWith('sha256='))
            return false;
        const expected = 'sha256=' + (0, crypto_1.createHmac)('sha256', appSecret).update(rawBody).digest('hex');
        return safeEqual(signature, expected);
    }
};
exports.SignatureGuard = SignatureGuard;
exports.SignatureGuard = SignatureGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SignatureGuard);
function safeEqual(a, b) {
    if (a.length !== b.length)
        return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
//# sourceMappingURL=signature.guard.js.map