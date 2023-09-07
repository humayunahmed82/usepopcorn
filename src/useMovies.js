import { useEffect, useState } from "react";

const KEY = "913a2139";

export const useMovies = (query) => {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// callback?.();

		const controller = new AbortController();

		const fetchMoves = async () => {
			try {
				setIsLoading(true);
				setError("");
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
					{ signal: controller.signal }
				);

				if (!res.ok) throw new Error("Something went wrong with the request");

				const data = await res.json();

				if (data.Response === "False") throw new Error("Movies not found");

				setMovies(data.Search);
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}

		fetchMoves();
		return () => {
			controller.abort();
		};
	}, [query]);

	return { movies, isLoading, error };
};
