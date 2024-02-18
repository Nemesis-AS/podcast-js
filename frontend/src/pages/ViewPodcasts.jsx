import React, { useEffect, useState } from "react";

import PodcastCard from "../components/PodcastCard";

const ViewPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api/v1";

      const res = await fetch(`${BASE_URL}/feeds/all`);
      const json = await res.json();
      
      if (!json.success) return;

      setPodcasts(json.result);
    };

    fetchPodcasts();
  }, []);


  return (
    <section className="flex flex-row flex-wrap items-start gap-4 p-4 grow" data-page="viewpods">
      {
        podcasts.length == 0 ? (
          <section className="flex grow h-full items-center justify-center p-8 rounded-lg border-8 border-dashed border-emerald-700 text-emerald-700 text-4xl font-bold select-none">
            No feeds to show!
          </section>
        ) : podcasts.map(podcast => 
          <PodcastCard key={ podcast.id } podcastInfo={ podcast } />
        )
      }
    </section>
  )
};

export default ViewPodcasts;
