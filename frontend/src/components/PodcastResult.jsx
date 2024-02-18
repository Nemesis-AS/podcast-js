import React, { useContext } from "react";

import GlobalMethods from "../utils/GlobalMethods";

const PodcastResult = ({ podcastInfo }) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api/v1";
    const { addToast } = useContext(GlobalMethods);

    const addPodcasttoDB = async podcast => {
        const res = await fetch(`${BASE_URL}/feeds/add`, {
            method: "POST",
            body: JSON.stringify(podcast),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (res.status != 200) {
            addToast("An Error Occurred while adding podcast to DB!", "rose-700");
            return;
        }

        const json = await res.json();
        if (!json.success) {
            addToast("Invalid response recieved while adding podcast to DB!", "rose-700");
            return;
        }

        addToast("Added Podcast to Database!");
    };

    return (
        <div className="flex items-center">
            <img
                src={ podcastInfo.image || "" }
                alt={ podcastInfo.title || "" }
                className="w-[200px] aspect-square shrink-0"
            />
            <div className="py-2 px-4 flex flex-col gap-2 grow">
                <div className="flex gap-2 items-center font-bold no-underline text-current text-xl">
                { podcastInfo.title || "<Podcast Title>" }
                    <a className="text-current no-underline opacity-75" href={ podcastInfo.link || "#" } target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>
                <div className="card-subtext">
                    { podcastInfo.author || "<Podcast Author>" } | { podcastInfo.episodeCount || "X" } Episodes
                </div>
                <div className="card-desc">
                    { podcastInfo.description || "<Podcast Description>" }
                </div>
                <div className="flex gap-2">
                    {
                        podcastInfo.tags && podcastInfo.tags.map((tag, idx) => (
                            <div key={ idx } className="px-3 py-1 border-slate-900 border-2 rounded-full text-sm">{ tag }</div>
                        ))
                    }
                </div>
                <div className="flex gap-2 justify-end">
                    <button className="py-2 px-3 text-base font-bold bg-slate-600 text-slate-50 border-2 border-slate-800 rounded-lg cursor-pointer duration-300 hover:bg-slate-800" onClick={() => addPodcasttoDB( podcastInfo )} >+ Add Podcast</button>
                </div>
            </div>
        </div>
    );
};

export default PodcastResult;
