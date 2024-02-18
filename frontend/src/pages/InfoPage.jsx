import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GlobalMethods from "../utils/GlobalMethods";

const InfoPage = () => {
    const BASE_URL =
        import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api/v1";
    const [podcastInfo, setPodcastInfo] = useState({});
    const [episodes, setEpisodes] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    const { addToast } = useContext(GlobalMethods);

    useEffect(() => {
        fetchPodcastInfo();
        fetchPodcastEpisodes();
    }, [id]);

    const fetchPodcastInfo = async () => {
        const res = await fetch(`${BASE_URL}/feeds/${id}`);
        if (!res.status == 200) return;
        const json = await res.json();
        if (!json.success) return;
        setPodcastInfo(json.result);
    };

    const fetchPodcastEpisodes = async () => {
        const res = await fetch(`${BASE_URL}/feeds/${id}/episodes`);
        if (!res.status == 200) return;
        const json = await res.json();
        if (!json.success) return;
        setEpisodes(json.result);
    };

    const downloadEpisode = async (id) => {
        const res = await fetch(`${BASE_URL}/episodes/download/${id}`);
        if (!res.status == 200) {
            addToast("An Error Occurred!", "rose-700");
            return;
        }
        const json = await res.json();
        if (!json.success) {
            addToast("An Error Occurred!", "rose-700");
            return;
        }

        addToast("Queued Download!");
        // @todo! Disable the download button!
    };

    const deleteEpisode = async (id) => {
        const res = await fetch(`${BASE_URL}/episodes/delete/${id}`);
        if (!res.status == 200) {
            addToast("An Error Occurred!", "rose-700");
            return;
        }
        const json = await res.json();
        if (!json.success) {
            addToast("An Error Occurred!", "rose-700");
            return;
        }
        // console.log("Queued Download!");
        addToast("Queued Download!");
        // @todo! Disable the delete button!
    };

    const verifyFiles = async () => {
        const res = await fetch(`${BASE_URL}/feeds/${id}/verify`);
        if (!res.status == 200) {
            addToast("An Error Occurred while verifying files!", "rose-700");
            return;
        }
        const json = await res.json();
        if (!json.success) {
            console.log(json);
            addToast(
                "Invalid Data recieved while verifying files!",
                "rose-700"
            );
            return;
        }

        fetchPodcastEpisodes();
        addToast("Verified Files Successfully!");
    };

    const removeFeed = async () => {
        const res = await fetch(`${BASE_URL}/feeds/${id}/remove`);
        if (!res.status == 200) {
            addToast("An Error Occurred while remove feed!", "rose-700");
            return;
        }
        const json = await res.json();
        if (!json.success) {
            console.log(json);
            addToast("Invalid Data recieved while removing feed!", "rose-700");
            return;
        }

        addToast("Removed Feed Successfully!");
        navigate("/");
    };

    // Utils
    const formatTime = (time) => {
        const hrs = String(Math.floor(time / 3600)).padStart(2, "0");
        const mins = String(Math.floor(time / 60)).padStart(2, "0");
        const secs = String(time % 60).padStart(2, "0");

        if (hrs > 0) return `${hrs}:${mins}:${secs}`;
        return `${mins}:${secs}`;
    };

    const prettyDate = (epoch) => {
        const MONTHS = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const date = new Date(epoch * 1000);
        return `${
            MONTHS[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`;
    };

    return (
        <section className="p-2 text-slate-900 flex flex-col gap-4">
            <div className="bg-slate-400 text-slate-700 flex rounded-lg px-4 py-4">
                <button
                    className="flex flex-col items-center gap-1 px-6 hover:text-slate-900 transition-colors duration-300 border-r border-slate-700"
                    onClick={verifyFiles}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                    <span className="text-sm">Verify Files</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-6 hover:text-slate-900 transition-colors duration-300 border-x border-slate-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                    </svg>
                    <span className="text-sm">Download All</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 px-6 hover:text-slate-900 transition-colors duration-300 border-l border-slate-700"
                    onClick={removeFeed}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                    <span className="text-sm">Remove Feed</span>
                </button>
            </div>
            <div className="podcast-header bg-slate-300 text-slate-900 p-3 grid grid-cols-4 rounded-xl">
                <img
                    className="w-100 p-4 aspect-square rounded-3xl"
                    src={podcastInfo.image || ""}
                    alt={podcastInfo.title || ""}
                />
                <div className="podcast-text col-span-3">
                    <div className="podcast-title text-xl font-bold flex gap-2 items-center">
                        {podcastInfo.title || "<Podcast Title>"}
                        <a href={podcastInfo.link || "#"} target="_blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                            </svg>
                        </a>
                    </div>
                    <div className="podcast-subtext text-base text-slate-700">
                        {podcastInfo.author || "<Podcast Author>"} |{" "}
                        {podcastInfo.episodeCount || "X"} Episodes
                    </div>
                    <div className="text-sm py-4">
                        {podcastInfo.description || "<Podcast Description>"}
                    </div>
                    <div className="flex gap-2">
                        {podcastInfo.tags &&
                            podcastInfo.tags.map((tag, idx) => (
                                <div
                                    key={idx}
                                    className="px-3 py-1 border-slate-900 border-2 rounded-full text-sm"
                                >
                                    {tag}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className="episodes w-full">
                <table className="w-full table-auto text-center border border-slate-600 border-collapse">
                    <thead>
                        <tr className="border border-slate-600">
                            <th className="p-1">No.</th>
                            <th className="p-1">Title</th>
                            <th className="p-1">Publish Date</th>
                            <th className="p-1">Duration</th>
                            <th className="p-1">Download</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-100 even:bg-slate-200">
                        {episodes.map((ep, idx) => (
                            <tr key={idx}>
                                <td className="p-1">{idx + 1}</td>
                                <td className="p-1">
                                    {ep.title || "<Episode Title>"}
                                </td>
                                <td className="p-1">
                                    {prettyDate(ep.publish_date) ||
                                        "<Publish Date>"}
                                </td>
                                <td className="p-1">
                                    {formatTime(ep.duration) || "<Duration>"}
                                </td>
                                <td className="p-1">
                                    {ep.downloaded ? (
                                        <button
                                            className="text-rose-600 hover:text-rose-800 border-rose-600 hover:border-rose-800 p-2 border-2 rounded-md transition duration-300"
                                            onClick={() => deleteEpisode(ep.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            className="text-emerald-600 hover:text-emerald-800 border-emerald-600 hover:border-emerald-800 p-2 border-2 rounded-md transition duration-300"
                                            onClick={() =>
                                                downloadEpisode(ep.id)
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default InfoPage;
