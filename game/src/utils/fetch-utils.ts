export class FetchUtils {
	static async fetchByteBuffer(uri: string) {
		const response = await fetch(uri);
		const data = await response.arrayBuffer();
		return data;
	}
}
