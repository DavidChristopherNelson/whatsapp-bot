"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waIdToE164IndiaOnly = waIdToE164IndiaOnly;
function waIdToE164IndiaOnly(waId) {
    const digits = (waId || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
        return `+${digits}`;
    }
    if (digits.length === 10) {
        return `+91${digits}`;
    }
    return null;
}
//# sourceMappingURL=phone.util.js.map