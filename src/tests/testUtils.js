"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockContext = exports.generarEvento = void 0;
const generarEvento = (payload) => ({
    body: JSON.stringify(payload),
});
exports.generarEvento = generarEvento;
exports.mockContext = {
    functionName: "testFunction",
    awsRequestId: "req-123",
};
