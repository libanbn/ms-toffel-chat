import { createContext, useContext } from 'react';
import seqLogger from 'seq-logging';

interface Log {
  trace: (msg: string) => void;
  debug: (msg: string) => void;
  information: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  critical: (msg: string) => void;
}

const LoggerContext = createContext<Log | undefined>(undefined);

export const Logger: React.FC = ({ children }) => {
  const logger = new seqLogger.Logger({
    serverUrl: process.env.REACT_APP_SEQ_LOGGER_SEVER_URL,
    onError: (e) => console.log(e),
  });

  const log = (level: string, msg: string) => {
    logger.emit({
      timestamp: new Date(),
      level,
      messageTemplate: msg,
    });
  };

  const trace = (msg: string) => log('Trace', msg);
  const debug = (msg: string) => log('Debug', msg);
  const information = (msg: string) => log('Information', msg);
  const warn = (msg: string) => log('Warn', msg);
  const error = (msg: string) => log('Error', msg);
  const critical = (msg: string) => log('Critical', msg);

  return (
    <LoggerContext.Provider value={{ trace, debug, information, warn, error, critical }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => {
  const ctx = useContext(LoggerContext);

  if (!ctx) {
    throw new Error('useLogger must be used inside LoggerContext');
  }

  return ctx;
};
