"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJwtToken = void 0;
function extractJwtToken(req) {
    const result = { success: false, token: '' };
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer'))
        return result;
    const token = authorization.split(' ')[1];
    if (!token)
        return result;
    result.token = token;
    result.success = true;
    return result;
}
exports.extractJwtToken = extractJwtToken;
