export function formatDate(date: Date, format: string) {
	if (!date) return '';

	const padZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
	const parts = {
		yyyy: date.getFullYear(),
		MM: padZero(date.getMonth() + 1),
		dd: padZero(date.getDate()),
		HH: padZero(date.getHours()),
		hh: padZero(date.getHours() > 12 ? date.getHours() - 12 : date.getHours()),
		mm: padZero(date.getMinutes()),
		ss: padZero(date.getSeconds()),
		tt: date.getHours() < 12 ? 'AM' : 'PM',
	};

	return format.replace(/%yyyy|%MM|%dd|%HH|%hh|%mm|%ss|%tt/g, match => parts[match.replace('%', '')]);
}
