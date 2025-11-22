"use client";

import React from 'react';

export function SpotifyWidget() {
    // Default playlist: "Deep Focus" or similar popular focus playlist
    // Using Spotify Embed IFrame
    const spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0";

    return (
        <div className="bg-black rounded-3xl p-1 shadow-soft overflow-hidden h-full min-h-[152px]">
            <iframe
                style={{ borderRadius: '12px' }}
                src={spotifyEmbedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
            ></iframe>
        </div>
    );
}
