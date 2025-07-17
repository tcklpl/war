export class URLUtils {
	static prepareServerURL(address: string) {
		let url: URL;
		try {
			// instantiating an URL without http:// will throw a TypeError
			url = new URL(address);

			if (!url.hostname) {
				url = new URL(`http://${address}`);
			}
		} catch {
			url = new URL(`http://${address}`);
		}

		if (!url.port) {
			url.port = '36875';
		}

		return url.toString();
	}
}
