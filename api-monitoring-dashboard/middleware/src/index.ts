import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

interface MiddlewareOptions {
  backendUrl: string;
  apiKey: string;
}

export function usageMonitoringMiddleware(options: MiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', async () => {
      const duration = Date.now() - start;
      const usageData = {
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: duration,
        timestamp: new Date().toISOString(),
      };

      try {
        await axios.post(`${options.backendUrl}/usage`, usageData, {
          headers: {
            Authorization: `Bearer ${options.apiKey}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error sending usage data:', error.message);
        } else {
          console.error('Error sending usage data:', error);
        }
      }
    });

    next();
  };
}
