export function prettyName(name: string) {
	let prettyName = name.replace('_AND_', ' & ').replace(/_/g, ' ');
	return prettyName
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
		.replace('Ios', 'iOS')
		.replace('Ipad', 'iPad');
}
