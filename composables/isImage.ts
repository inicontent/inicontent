export default function (singleValue?: string) {
	return (
		singleValue &&
		["png", "jpg", "jpeg", "ico", "webp", "svg", "gif"].includes(
			singleValue.split(".").pop() as string,
		)
	);
}
