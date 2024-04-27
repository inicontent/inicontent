export default defineNuxtPlugin(() => {
	const client = useState<Record<string, any>>("client", () => ({
			ip: null,
			userAgent: null,
		})),
		event = useRequestEvent();

	client.value.ip =
		event?.node.req.headers["x-real-ip"] ||
		event?.node.req.headers["x-forwarded-for"] ||
		event?.node.req.socket?.remoteAddress;

	client.value.userAgent = event?.node.req.headers["user-agent"];
});
