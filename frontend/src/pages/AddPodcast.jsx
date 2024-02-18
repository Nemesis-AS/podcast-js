import React, { useState, useContext } from "react";

import PodcastResult from "../components/PodcastResult";

import GlobalMethods from "../utils/GlobalMethods";

const AddPodcast = () => {
    const BASE_URL =
        import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api/v1";
    const [term, setTerm] = useState("");
    const [podcasts, setPodcasts] = useState([]);
    const [fetching, setFetching] = useState(false);

    const { addToast } = useContext(GlobalMethods);

    const getPodcastsByTerm = async (e) => {
        setFetching(true);
        e.preventDefault();
        const res = await fetch(`${BASE_URL}/feeds/remote/byterm/${term}`);
        if (!res.status == 200) {
            addToast("An Error Occurred while Fetching feeds!", "rose-700");
            setFetching(false);
            return;
        }
        const json = await res.json();
        console.log(json);

        if (!json.status) {
            addToast("Invalid Response while Fetching feeds!", "rose-700");
            setFetching(false);
            return;
        }
        setFetching(false);
        setPodcasts(json.result);
    };

    return (
        <section className="flex flex-col gap-4 p-4 grow">
            <form
                className="flex gap-0 w-full p-4"
                onSubmit={getPodcastsByTerm}
            >
                <input
                    className="p-1 text-base grow border-2 rounded-l-lg border-slate-800 border-r-0"
                    type="text"
                    placeholder="Search Podcasts..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="py-2 px-4 tet-base bg-slate-600 text-slate-50 border-2 border-slate-800 rounded-r-lg border-l-0 cursor-pointer duration-300 hover:bg-slate-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </form>

            <div className="flex flex-col gap-1 flex-grow">
                {fetching ? (
                    <div className="flex-grow flex items-center justify-center text-4xl font-extrabold border-dashed border-8 border-slate-500 text-slate-500 bg-slate-200 rounded-lg">
                        Fetching...
                    </div>
                ) : podcasts.length ? (
                    podcasts.map((podcast) => (
                        <PodcastResult key={podcast.id} podcastInfo={podcast} />
                    ))
                ) : (
                    <div className="flex-grow flex items-center justify-center text-4xl font-extrabold border-dashed border-8 border-slate-500 text-slate-500 bg-slate-200 rounded-lg">
                        No Results Found!
                    </div>
                )}
            </div>
        </section>
    );
};

export default AddPodcast;
