import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "913a2139";

const App = () => {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const [selectedId, setSelectedId] = useState(null);

	const handelSelectMovie = (id) => {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
		// setSelectedId(id);
	};
	const handelMovieClose = () => {
		setSelectedId(null);
	};
	const handelWatchedMovie = (move) => {
		setWatched((watched) => [...watched, move]);
	};

	const handelDeleteMovie = (id) => {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	};

	useEffect(() => {
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

		handelMovieClose();
		fetchMoves();
		return () => {
			controller.abort();
		};
	}, [query]);

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResult movies={movies} />
			</NavBar>

			<Main>
				<Box>
					{/* {isLoading ? (
						<Loader />
					) : (
						<MovieList>
							{movies?.map((movie) => (
								<MovieItem key={movie.imdbID} movie={movie} />
							))}
						</MovieList>
					)} */}
					{isLoading && <Loader />}

					{!isLoading && !error && (
						<MovieList>
							{movies?.map((movie) => (
								<MovieItem
									key={movie.imdbID}
									movie={movie}
									onSelectMovie={handelSelectMovie}
								/>
							))}
						</MovieList>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							key={selectedId}
							selectedId={selectedId}
							onCloseMove={handelMovieClose}
							onAddWatchMovie={handelWatchedMovie}
							watched={watched}
						/>
					) : (
						<>
							<Summary watched={watched} />

							<MovieList>
								{watched?.map((movie) => (
									<MovieWatchedItem
										key={movie.imdbID}
										movie={movie}
										onDeleteMovie={handelDeleteMovie}
									/>
								))}
							</MovieList>
						</>
					)}
				</Box>
			</Main>
		</>
	);
};

export default App;

const ErrorMessage = ({ message }) => {
	return (
		<p className="error">
			<span>⛔</span> {message}
		</p>
	);
};

const Loader = () => {
	return <p className="loader">Loading...</p>;
};

const NavBar = ({ children }) => {
	return <nav className="nav-bar">{children}</nav>;
};

const Logo = () => {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
};
const Search = ({ query, setQuery }) => {
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
};
const NumResult = ({ movies }) => {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
};

const Main = ({ children }) => {
	return <main className="main">{children}</main>;
};

const Box = ({ children }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />

			{isOpen && children}
		</div>
	);
};

// const Box = ({ element }) => {
//     const [isOpen, setIsOpen] = useState(true)

//     return (
//         <div className="box">
//             <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />

//             {isOpen && element}
//         </div>
//     )
// }

const ToggleButton = ({ isOpen, setIsOpen }) => {
	return (
		<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
			{isOpen ? "–" : "+"}
		</button>
	);
};

const MovieList = ({ children }) => {
	return <ul className="list list-movies">{children}</ul>;
};

const MovieItem = ({ movie, onSelectMovie }) => {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
};

const MovieWatchedItem = ({ movie, onDeleteMovie }) => {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>

				<button
					className="btn-delete"
					onClick={() => onDeleteMovie(movie.imdbID)}
				>
					X
				</button>
			</div>
		</li>
	);
};

const Summary = ({ watched }) => {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(2)} min</span>
				</p>
			</div>
		</div>
	);
};

const MovieDetails = ({
	selectedId,
	onCloseMove,
	onAddWatchMovie,
	watched,
}) => {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");
	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === selectedId
	)?.userRating;

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Released: released,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	const handelAdd = () => {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
		};

		onAddWatchMovie(newWatchedMovie);
		onCloseMove();
	};

	useEffect(() => {
		const callBack = (e) => {
			if (e.code === "Escape") {
				onCloseMove();
			}
		};

		document.addEventListener("keydown", callBack);
		return () => {
			document.removeEventListener("keydown", callBack);
		};
	}, [onCloseMove]);

	useEffect(() => {
		const getMovieDetails = async () => {
			setIsLoading(true);
			const res = await fetch(
				`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
			);

			const data = await res.json();

			setMovie(data);
			setIsLoading(false);
		};

		getMovieDetails();
	}, [selectedId]);

	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;

		return () => {
			document.title = "usePopcorn";
		};
	}, [title]);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={() => onCloseMove()}>
							&#129044;
						</button>
						<img src={poster} alt={`Poster of ${poster}`} />
						<div className="details-overview">
							<h2 className="title">{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span> {imdbRating} IMDb Rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button className="btn-add" onClick={handelAdd}>
											+ Add Movie
										</button>
									)}
								</>
							) : (
								<p>
									You Rated with movie {watchedUserRating} <span>⭐</span>
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Director by {director}</p>
					</section>
				</>
			)}
		</div>
	);
};
