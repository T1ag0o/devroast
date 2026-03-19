"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
	value: number;
	precision?: number;
}

export function AnimatedNumber({ value, precision = 0 }: AnimatedNumberProps) {
	const [displayValue, setDisplayValue] = useState(value);
	const prevValueRef = useRef(value);

	useEffect(() => {
		const start = prevValueRef.current;
		const end = value;
		const duration = 800;
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeOut = 1 - (1 - progress) ** 3;
			const current = start + (end - start) * easeOut;
			setDisplayValue(current);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				prevValueRef.current = end;
			}
		};

		requestAnimationFrame(animate);
	}, [value]);

	return <span>{displayValue.toFixed(precision)}</span>;
}
