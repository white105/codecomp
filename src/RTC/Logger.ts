/*
Prints log messages depending on the debug level passed in. Defaults to 0.
0 -> Prints no logs.
1 -> Prints only errors.
2 -> Prints errors and warnings.
3 -> Prints all logs.
*/
export enum LogLevel {
    disabled,
    errors,
    warnings,
    all
};

const print = (logLevel: LogLevel, LOG_PREFIX, ...rest: any[]): void => {
    const copy = [LOG_PREFIX, ...rest];

    for (let i in copy) {
        if (copy[i] instanceof Error) {
            copy[i] = `(${copy[i].name})${copy[i].message}`;
        }
    }

    if (logLevel >= LogLevel.all) console.log(...copy);
    else if (logLevel >= LogLevel.warnings) console.warn("WARNING", ...copy);
    else if (logLevel >= LogLevel.errors) console.error("ERROR", ...copy);
}

class Logger {
    private _logLevel = LogLevel.disabled;
    private _LOG_PREFIX = "RTC: "

    set logPrefix(prefix: string) { this._LOG_PREFIX = prefix }

    get logLevel(): LogLevel { return this._logLevel; }

    set logLevel(logLevel: LogLevel) { this._logLevel = logLevel; }

    log(...args: any[]) {
        if (this._logLevel >= LogLevel.all) print(LogLevel.all, this._LOG_PREFIX, ...args);
    }

    warn(...args: any[]) {
        if (this._logLevel >= LogLevel.warnings) print(LogLevel.warnings, this._LOG_PREFIX, ...args);
    }

    error(...args: any[]) {
        if (this._logLevel >= LogLevel.errors) print(LogLevel.errors, this._LOG_PREFIX, ...args);
    }
}

export default new Logger();
export { Logger }