import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Navbar from "./components/Navbar";

import ViewPodcasts from "./pages/ViewPodcasts";
import AddPodcast from "./pages/AddPodcast";
import OptionsPage from "./pages/OptionsPage";
import InfoPage from "./pages/InfoPage";

import ToastManager from "./components/ToastManager";

import GlobalMethods from "./utils/GlobalMethods";

function App() {
    const [toasts, setToasts] = useState([
        // {
        //     text: "Something",
        //     color: "emerald-700"
        // }
    ]);

    const DEFAULT_DELAY = 4000;

    const addToast = (text, color = "emerald-700") => {
        /* delay = 5000 */
        setToasts([...toasts, { text, color }]);

        setTimeout(popToast, DEFAULT_DELAY);
    };

    const popToast = () => {
        setToasts((toasts) => {
            if (toasts.length === 0) return;
            return toasts.slice(0, toasts.length - 1);
        });
    };

    return (
        <GlobalMethods.Provider value={{ addToast }}>
            <Header />
            <main className="grow flex items-stretch">
                <Navbar />
                <Routes>
                    <Route index element={<ViewPodcasts />} />
                    <Route path="add-podcast" element={<AddPodcast />} />
                    <Route path="options" element={<OptionsPage />} />
                    <Route path="podcast/:id" element={<InfoPage />} />
                </Routes>
            </main>
            <ToastManager toasts={toasts} defaultDelay={DEFAULT_DELAY} />
        </GlobalMethods.Provider>
    );
}

export default App;
