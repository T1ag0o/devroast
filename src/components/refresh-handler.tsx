"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RefreshHandler() {
	const router = useRouter();

	useEffect(() => {
		router.refresh();
	}, [router]);

	return null;
}
