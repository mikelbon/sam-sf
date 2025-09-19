export const generarEvento = (payload: any) => ({
  body: JSON.stringify(payload),
});

export const mockContext = {
  functionName: "testFunction",
  awsRequestId: "req-123",
};