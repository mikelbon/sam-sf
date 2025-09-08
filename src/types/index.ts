export interface ConfirmacionInput {
  referencia: string;
  medio: string;
  estado: "aprobado" | "rechazado";
  usuarioId?: string;
}

export interface ConfirmacionOutput {
  confirmado: boolean;
  referencia: string;
  medio: string;
  timestamp: string;
}
export interface ValidacionPayload {
  monto: number;
  medio: string;
  usuarioId: string;
}
export interface ValidacionInput {
  monto: number;
  medio: "tarjeta" | "yape";
  usuarioId: string;
}

export interface ValidacionOutput {
  validado: boolean;
  monto: number;
  medio: string;
  usuarioId: string;
}

export interface GetTransaccionInput {
  referencia: string;
}

export interface GetTransaccionOutput {
  referencia: string;
  medio: string;
  estado: string;
  timestamp: string;
  usuarioId: string;
}
export interface ErrorPayload {
  Error: string;
  Cause?: string;
}
export interface ParsedCause {
  errorType?: string;
  errorMessage?: string;
  trace?: string[];
}


export interface ErrorResponse {
  manejado: boolean;
  mensaje: string;
  tipo?: string;
  detalles?: Record<string, unknown>;
}

export type MedioPago = "tarjeta" | "yape";

export interface PagoInput {
  monto: number;
  medio: MedioPago;
  usuarioId: string;
}

export interface PagoOutput {
  referencia: string;
  estado: string;
  medio: string;
  monto: number;
  usuarioId: string;
}

export interface ListTransaccionesInput {
  usuarioId: string;
}

export interface Transaccion {
  referencia: string;
  medio: string;
  estado: string;
  timestamp: string;
  usuarioId: string;
}

export interface DynamoItem{
  referencia?: { S: string };
  medio?: { S: string };
  estado?: { S: string };
  timestamp?: { S: string };
  usuarioId?: { S: string };
}
