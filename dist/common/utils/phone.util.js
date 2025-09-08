"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedNumberError = void 0;
exports.toE164India = toE164India;
class UnsupportedNumberError extends Error {
    constructor(message = 'Unsupported phone number') {
        super(message);
        this.name = 'UnsupportedNumberError';
    }
}
exports.UnsupportedNumberError = UnsupportedNumberError;
function toE164India(waId) {
    const digits = (waId || '').replace(/\D/g, '');
    const isIndiaPrefixed = digits.startsWith('91');
    const isValidLength = digits.length >= 12 && digits.length <= 13;
    if (isIndiaPrefixed && isValidLength) {
        return `+${digits}`;
    }
    throw new UnsupportedNumberError();
}
//# sourceMappingURL=phone.util.js.map