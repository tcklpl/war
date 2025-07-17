export interface LoggerConfig {
	log_level: 'trace' | 'debug' | 'info' | 'warn' | 'error';
	log_time_format: string;
	log_max_buffer_lines: number;
	log_crashlog_folder: string;
	log_crashlog_ignore_log_level: boolean;
	log_crashlog_file_name: string;
}
