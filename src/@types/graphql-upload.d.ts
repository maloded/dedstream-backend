declare module 'graphql-upload' {
	import type { ReadStream } from 'node:fs';

	export interface FileUpload {
		filename: string;
		mimetype: string;
		encoding: string;
		createReadStream: () => ReadStream;
	}

	export function graphqlUploadExpress(options?: {
		maxFileSize?: number;
		maxFiles?: number;
	}): any;
}
