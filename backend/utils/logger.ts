import { Request } from 'express';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldData?: any;
  newData?: any;
  metadata?: any;
}

export class DatabaseLogger {
  private static formatLog(level: string, context: LogContext, message?: string): string {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message: message || `${context.action} ${context.resource}`,
      context: {
        action: context.action,
        resource: context.resource,
        resourceId: context.resourceId,
        userId: context.userId,
        sessionId: context.sessionId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
      data: {
        old: context.oldData,
        new: context.newData,
        metadata: context.metadata,
      }
    };

    return JSON.stringify(logData, null, 2);
  }

  static logCreate(context: LogContext, message?: string): void {
    const logMessage = this.formatLog('INFO', context, message);
    console.log(`[DB_CREATE] ${logMessage}`);
  }

  static logUpdate(context: LogContext, message?: string): void {
    const logMessage = this.formatLog('INFO', context, message);
    console.log(`[DB_UPDATE] ${logMessage}`);
  }

  static logDelete(context: LogContext, message?: string): void {
    const logMessage = this.formatLog('WARN', context, message);
    console.warn(`[DB_DELETE] ${logMessage}`);
  }

  static logSoftDelete(context: LogContext, message?: string): void {
    const logMessage = this.formatLog('INFO', context, message);
    console.log(`[DB_SOFT_DELETE] ${logMessage}`);
  }

  static logRestore(context: LogContext, message?: string): void {
    const logMessage = this.formatLog('INFO', context, message);
    console.log(`[DB_RESTORE] ${logMessage}`);
  }

  static logAccess(context: LogContext, message?: string): void {
    const logMessage = this.formatLog('INFO', context, message);
    console.log(`[DB_ACCESS] ${logMessage}`);
  }

  static logError(context: LogContext, error: Error, message?: string): void {
    const errorContext = {
      ...context,
      metadata: {
        ...context.metadata,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      }
    };
    const logMessage = this.formatLog('ERROR', errorContext, message);
    console.error(`[DB_ERROR] ${logMessage}`);
  }

  static extractRequestContext(req: Request): Partial<LogContext> {
    return {
      ipAddress: req.ip || (req as any).connection?.remoteAddress,
      userAgent: req.get('User-Agent'),
      sessionId: (req as any).session?.id || req.get('X-Session-ID'),
      userId: (req as any).admin?.id || (req as any).user?.id,
    };
  }
}

// Audit trail types
export interface AuditLogEntry {
  id?: string;
  table_name: string;
  record_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  old_values?: any;
  new_values?: any;
  user_id?: string;
  user_type?: 'admin' | 'guest';
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
  metadata?: any;
}

// Utility functions for common logging patterns
export const logModelOperation = (
  req: Request,
  action: string,
  resource: string,
  resourceId?: string,
  oldData?: any,
  newData?: any
): void => {
  const context: LogContext = {
    ...DatabaseLogger.extractRequestContext(req),
    action,
    resource,
    resourceId,
    oldData,
    newData,
  };

  switch (action.toLowerCase()) {
    case 'create':
      DatabaseLogger.logCreate(context);
      break;
    case 'update':
      DatabaseLogger.logUpdate(context);
      break;
    case 'delete':
      DatabaseLogger.logDelete(context);
      break;
    case 'soft_delete':
      DatabaseLogger.logSoftDelete(context);
      break;
    case 'restore':
      DatabaseLogger.logRestore(context);
      break;
    default:
      DatabaseLogger.logAccess(context);
  }
};