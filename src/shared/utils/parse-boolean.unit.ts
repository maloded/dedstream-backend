export function parseBoolean(value: string): boolean {
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'string') {
		const lowerValue = value.toLowerCase().trim();
		if (lowerValue === 'true') {
			return true;
		}
		if (lowerValue === 'false') {
			return false;
		}
	}

	throw new Error(`Cannot parse boolean from value: ${value}`);
}
