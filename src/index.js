import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import StarRating from "./StarRating";
// import "./index.css"
// import App from "./App"

const TestRating = () => {
    const [movieRating, setMovieRating] = useState(0);

    return (
        <div className="">
            <StarRating
                maxRating={10}
                color="blue"
                onSetRating={setMovieRating}
            />
            ;<p>This movie was rated {movieRating} Start</p>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        {/* <App /> */}

        <StarRating messages={["Terrible", "bad", "Okay", "Good", "Amazing"]} />
        <StarRating maxRating={5} className="Text" defaultRating={3} />
        <TestRating />
    </React.StrictMode>
);
