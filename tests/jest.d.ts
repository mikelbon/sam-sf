// jest.d.ts
import "aws-sdk-client-mock-jest";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveReceivedCommandTimes(command: any, times: number): R;
      toHaveReceivedCommandWith(command: any, input: any): R;
    }
  }
}
