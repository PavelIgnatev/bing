import { sleep } from "./sleep";

interface TypeWithExponentialBackoff {
  func: any;
  maxRetries: number;
  delay: number;
  cleanup?: any;
}

export const withExponentialBackoff = ({
  func,
  maxRetries = 5,
  delay = 1000,
  cleanup,
}: TypeWithExponentialBackoff) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return func();
    } catch (error) {
      if (cleanup) {
        cleanup();
      }
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(`Error: ${error}. Retrying in ${delay / 1000} seconds...`);
      sleep(delay);
      delay *= 2;
    }
  }
};
