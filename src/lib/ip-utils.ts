import crypto from "node:crypto";

export function hashIp(ip: string): string {
	return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 64);
}

export function getClientIp(headers: Headers): string {
	const forwarded = headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	return headers.get("x-real-ip") || "127.0.0.1";
}
