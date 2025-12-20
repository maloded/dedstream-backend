const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Weeks'
	| 'Week'
	| 'Wks'
	| 'Wk'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 'S'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Millisecs'
	| 'Millisec'
	| 'Ms';

type UnitAnyCase = Unit | Lowercase<Unit> | Uppercase<Unit>;

export type StringValue =
	| `${number}`
	| `${number} ${UnitAnyCase}`
	| `${number}${UnitAnyCase}`;
function assertNever(x: never): never {
	throw new Error(`Unknown time unit: ${String(x)}`);
}

export function ms(str: StringValue): number {
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error(
			'Value provided to ms util must be a non-empty string with a maximum length of 100 characters',
		);
	}

	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|millisecond|millisecs|millisec|ms|seconds?|secs?|sec|s|minutes?|mins?|min|m|hours?|hrs?|hr|h|days?|day|d|weeks?|wks?|wk|w|years?|yrs?|yr|y)?$/i.exec(
			str,
		);

	const groups = match?.groups as
		| { value: string; type?: string }
		| undefined;
	if (!groups) {
		return NaN;
	}
	const n = parseFloat(groups.value);
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>;

	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y;
		case 'weeks':
		case 'week':
		case 'wks':
		case 'wk':
		case 'w':
			return n * w;
		case 'days':
		case 'day':
		case 'd':
			return n * d;
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h;
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m;
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s;
		case 'milliseconds':
		case 'millisecond':
		case 'millisecs':
		case 'millisec':
		case 'ms':
			return n;
		default:
			return assertNever(type);
	}
}
