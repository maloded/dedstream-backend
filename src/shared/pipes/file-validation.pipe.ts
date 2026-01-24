import {
	BadRequestException,
	Injectable,
	type PipeTransform,
} from '@nestjs/common';
import { ReadStream } from 'fs';
import { validateFileFormat, validateFileSize } from '../utils/file.util';

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any) {
		if (!value.filename) {
			throw new BadRequestException('File is not uploaded');
		}

		const { filename, createReadStream } = value;
		// eslint-disable-next-line
		const fileStream = createReadStream() as ReadStream;

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
		// eslint-disable-next-line
		const isFileFormatValid = validateFileFormat(filename, allowedFormats);

		if (!isFileFormatValid) {
			throw new BadRequestException('No valid file format');
		}

		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024,
		);

		if (!isFileSizeValid) {
			throw new BadRequestException('File size is over 10Gb');
		}
		// eslint-disable-next-line
		return value;
	}
}
