/**
 * Composable for handling realtime data synchronization
 * Establishes WebSocket connection and updates data reactively
 */

import type { Ref } from "vue";

interface RealtimeMessage {
	type: "subscribed" | "error" | "data_change";
	action?: "create" | "update" | "delete";
	data?: any;
	database?: string;
	table?: string;
	timestamp?: string;
	message?: string;
}

export function useRealtimeSync(
	table: Ref<Table | undefined>,
	data: Ref<apiResponse<Item[]> | undefined>,
	database: Ref<Database | undefined>,
) {
	const websocket = ref<WebSocket | null>(null);
	const isConnected = ref(false);
	const isConnecting = ref(false);

	/**
	 * Connect to realtime updates via WebSocket
	 */
	const connect = () => {
		if (!table.value || !database.value || !table.value.config?.realtime) {
			return;
		}

		if (isConnecting.value || isConnected.value) {
			return;
		}

		// Don't connect on server
		if (process.server) {
			return;
		}

		isConnecting.value = true;

		try {
			const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
			const host = window.location.host;
			websocket.value = new WebSocket(`${protocol}//${host}/realtime`);

			websocket.value.onopen = () => {
				isConnected.value = true;
				isConnecting.value = false;

				// Subscribe to table updates
				const subscribeMessage = {
					type: "subscribe",
					database: database.value?.slug,
					table: table.value?.slug,
					userId: undefined, // Set from auth if available
					sessionId: useCookie("sessionID").value,
				};

				websocket.value?.send(JSON.stringify(subscribeMessage));
				console.log("Connected to realtime updates");
			};

			websocket.value.onmessage = (event) => {
				handleRealtimeMessage(JSON.parse(event.data) as RealtimeMessage);
			};

			websocket.value.onerror = (error) => {
				console.error("WebSocket error:", error);
				isConnecting.value = false;
			};

			websocket.value.onclose = () => {
				isConnected.value = false;
				isConnecting.value = false;
				console.log("Disconnected from realtime updates");

				// Attempt to reconnect after 3 seconds
				if (table.value?.config?.realtime) {
					setTimeout(() => {
						connect();
					}, 3000);
				}
			};
		} catch (error) {
			console.error("Failed to establish WebSocket connection:", error);
			isConnecting.value = false;
		}
	};

	/**
	 * Handle incoming realtime messages
	 */
	const handleRealtimeMessage = (message: RealtimeMessage) => {
		if (message.type === "subscribed") {
			console.log("Subscribed to realtime updates:", message.message);
		} else if (message.type === "data_change") {
			updateDataFromRealtimeChange(message);
		} else if (message.type === "error") {
			console.error("Realtime error:", message.message);
		}
	};

	/**
	 * Update local data based on realtime changes
	 */
	const updateDataFromRealtimeChange = (message: RealtimeMessage) => {
		if (!data.value?.result || !message.action) {
			return;
		}

		const dataArray = Array.isArray(data.value.result)
			? data.value.result
			: [data.value.result];

		switch (message.action) {
			case "create": {
				// Add new item to the beginning
				if (Array.isArray(message.data)) {
					dataArray.unshift(...message.data);
				} else if (message.data) {
					dataArray.unshift(message.data);
				}
				break;
			}

			case "update": {
				// Update existing item
				if (Array.isArray(message.data)) {
					message.data.forEach((newItem) => {
						const index = dataArray.findIndex((item) => item.id === newItem.id);
						if (index !== -1) {
							dataArray[index] = { ...dataArray[index], ...newItem };
						}
					});
				} else if (message.data) {
					const index = dataArray.findIndex(
						(item) => item.id === message.data.id,
					);
					if (index !== -1) {
						dataArray[index] = { ...dataArray[index], ...message.data };
					}
				}
				break;
			}

			case "delete": {
				// Remove deleted item
				if (message.data?.id) {
					const index = dataArray.findIndex(
						(item) => item.id === message.data.id,
					);
					if (index !== -1) {
						dataArray.splice(index, 1);
					}
				} else if (message.data?.deleted) {
					// Handle bulk delete
					const deletedIds = Array.isArray(message.data.deleted)
						? message.data.deleted
						: [message.data.deleted];
					deletedIds.forEach((id: any) => {
						const index = dataArray.findIndex((item) => item.id === id);
						if (index !== -1) {
							dataArray.splice(index, 1);
						}
					});
				}
				break;
			}
		}

		// Update reactive data
		if (data.value) {
			data.value.result = Array.isArray(data.value.result)
				? dataArray
				: dataArray[0];
		}
	};

	/**
	 * Disconnect from realtime updates
	 */
	const disconnect = () => {
		if (websocket.value) {
			websocket.value.close();
			websocket.value = null;
			isConnected.value = false;
		}
	};

	/**
	 * Watch table config changes and reconnect if realtime is toggled
	 */
	watch(
		() => table.value?.config?.realtime,
		(isRealtimeEnabled) => {
			if (isRealtimeEnabled) {
				connect();
			} else {
				disconnect();
			}
		},
	);

	/**
	 * Cleanup on unmount
	 */
	onBeforeUnmount(() => {
		disconnect();
	});

	return {
		isConnected,
		isConnecting,
		connect,
		disconnect,
	};
}
