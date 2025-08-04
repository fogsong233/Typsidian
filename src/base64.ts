const Base64 = {
	keyChar: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	encode: (text: string): string => {
		const encoder = new TextEncoder();
		const utf8Bytes = encoder.encode(text);
		let startIndex = 0;
		let startBits = 0;
		let result = "";
		while (startIndex < utf8Bytes.length) {
			switch (startBits) {
				case 0:
					result += Base64.keyChar[utf8Bytes[startIndex] >> 2];
					startBits = 6;
					break;
				case 2:
					result +=
						Base64.keyChar[utf8Bytes[startIndex] & 0b00111111];
					startBits = 0;
					startIndex++;
					break;
				case 4:
					result +=
						Base64.keyChar[
							((utf8Bytes[startIndex] & 0b00001111) << 2) |
								(utf8Bytes[startIndex + 1] >> 6)
						];
					startBits = 2;
					startIndex++;
					break;
				case 6:
					result +=
						Base64.keyChar[
							((utf8Bytes[startIndex] & 0b00000011) << 4) |
								(utf8Bytes[startIndex + 1] >> 4)
						];
					startBits = 4;
					startIndex++;
					break;
				default:
					throw new Error("Base64 encoding error: invalid startBits");
			}
			if (startIndex === utf8Bytes.length - 1 && startBits > 2) {
				if (startBits === 4) {
					result +=
						Base64.keyChar[
							(utf8Bytes[startIndex] & 0b00001111) << 2
						];
					result += "=";
				} else if (startBits === 6) {
					result +=
						Base64.keyChar[
							(utf8Bytes[startIndex] & 0b00000011) << 4
						];
					result += "==";
				}
				break;
			}
		}
		return result;
	},
};

export default Base64;
