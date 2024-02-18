import React from "react";

const PodcastCard = ({ podcastInfo }) => {
  return (
    <div className="rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 duration-300">
        <img src={ podcastInfo.image || "" } alt={ podcastInfo.title || "Podcast Image" } className="w-[200px] aspect-square rounded-t-lg" />
        <div className="py-2 px-4 text-center w-[200px]">
            <a href={ `/podcast/${podcastInfo.id}` } className="font-bold text-current">{ podcastInfo.title || "<Podcast Title>" }</a>
        </div>
    </div>
  )
};

export default PodcastCard;