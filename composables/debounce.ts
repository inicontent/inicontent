export default function <T extends (...args: any[]) => void>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>
	return (...args: Parameters<T>): void => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), wait)
	}
}
