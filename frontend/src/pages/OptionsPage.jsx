import React, { useEffect, useContext, useState } from "react";

import GlobalMethods from "../utils/GlobalMethods";

const OptionsPage = () => {
    const BASE_URL =
        import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api/v1";
    const { addToast } = useContext(GlobalMethods);
    const [config, setConfig] = useState({});

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        const res = await fetch(`${BASE_URL}/config`);
        if (res.status != 200) {
            addToast("An Error occurred while fetching config!", "rose-700");
            return;
        }
        const json = await res.json();
        if (!json.success) {
            addToast(
                "Invalid response recieved while fetching config!",
                "rose-700"
            );
            return;
        }

        setConfig(json.result);
    };

    const handleInput = (key, value) => {
        const oldObj = { ...config };
        oldObj[key] = value;
        setConfig(oldObj);
    };

    const saveConfig = async () => {
        const res = await fetch(`${BASE_URL}/config`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ config: config }),
        });
        if (!res.status === 200) {
            addToast("An error occurred while saving config!", "rose-700");
            return;
        }

        const json = await res.json();
        if (!json.success) {
            addToast("Invalid response recieved while saving config!", "rose-700");
            return;
        }

        addToast("Saved Config Successfully!");
    };

    return (
        <section className="flex flex-col gap-3 p-2 grow">
            <div className="bg-slate-400 text-slate-700 flex rounded-lg px-4 py-4">
                <button className="flex flex-col items-center gap-1 px-6 hover:text-slate-900 transition-colors duration-300 border-r border-slate-700"
                onClick={loadConfig}>
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
                    <span className="text-sm">Refresh</span>
                </button>
                <button 
                    className="flex flex-col items-center gap-1 px-6 hover:text-slate-900 transition-colors duration-300 border-l border-slate-700"
                    onClick={saveConfig}
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
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                    </svg>

                    <span className="text-sm">Save</span>
                </button>
            </div>
            <h3 className="text-2xl font-normal px-2">Options</h3>
            {
                Object.keys(config).map(option => (
                    <div className="w-full flex gap-2 px-2" key={option}>
                        <label
                            className="text-right self-center w-[200px] capitalize"
                            htmlFor="savePath"
                        >
                            {option.replace("_", " ")}:
                        </label>
                        <input
                            className="font-base p-1 grow"
                            type="text"
                            id="savePath"
                            value = {(config[option])}
                            onChange = {
                                e => {
                                    handleInput(option, e.target.value);
                                }
                            }
                        />
                    </div>
                ))
            }

            
        </section>
    );
};

export default OptionsPage;
