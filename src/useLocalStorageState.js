import { useState, useEffect } from "react";

export const useLocalStorageState = (initialState, key) => {
	const [value, setValue] = useState(() => {
		const sortedValue = localStorage.getItem(key);

		return sortedValue ? JSON.parse(sortedValue) : initialState;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue];
};
