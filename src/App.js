// Builtin Hooks
import { useEffect, useRef, useState } from "react";

// Custom Hooks
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// Custom Component
import StarRating from "./StarRating";

const KEY = "913a2139";

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const App = () => {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	// Call for Hooks custom
	const { movies, isLoading, error } = useMovies(query);
	const [watched, setWatched] = useLocalStorageState([], "watched");

	const handelSelectMovie = (id) => {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
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

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResult movies={movies} />
			</NavBar>

			<Main>
				<Box>
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
	const inputEL = useRef(null);

	useKey("Enter", () => {
		if (document.activeElement === inputEL.current) return;
		inputEL.current.focus();
		setQuery("");
	});

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputEL}
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

	const countRef = useRef(0);

	useEffect(() => {
		if (userRating) countRef.current++;
	}, [userRating]);

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

	// const [isTop, setIsTop] = useState(imdbRating > 8);
	// console.log(isTop);

	// useEffect(() => {
	// 	setIsTop(imdbRating > 8);
	// }, [imdbRating]);

	// const isTop = imdbRating > 8;

	// const [avgRating, setAvgRating] = useState(0);

	const handelAdd = () => {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
			countRatingDecisions: countRef.current,
		};

		onAddWatchMovie(newWatchedMovie);
		onCloseMove();
	};

	useKey("Escape", onCloseMove);

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

					{/* <p>{avgRating}</p> */}

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

// 11. What are Custom Hooks When to Create One
