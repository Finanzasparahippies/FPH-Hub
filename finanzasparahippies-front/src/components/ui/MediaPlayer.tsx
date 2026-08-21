'use client';
import React from 'react';

interface MediaPlayerProps {
    url: string;
    type: 'video' | 'podcast';
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ url, type }) => {
    const getEmbedUrl = (sourceUrl: string) => {
        try {
            const parsedUrl = new URL(sourceUrl);
            
            // YouTube handling
            if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
                let videoId = '';
                if (parsedUrl.hostname.includes('youtu.be')) {
                    videoId = parsedUrl.pathname.slice(1);
                } else {
                    videoId = parsedUrl.searchParams.get('v') || '';
                }
                return `https://www.youtube.com/embed/${videoId}`;
            }

            // Spotify handling
            if (parsedUrl.hostname.includes('spotify.com')) {
                // e.g., https://open.spotify.com/episode/xyz -> https://open.spotify.com/embed/episode/xyz
                const pathPaths = parsedUrl.pathname.split('/').filter(Boolean);
                if (pathPaths.length >= 2) {
                    const type = pathPaths[0]; // track, episode, show
                    const id = pathPaths[1];
                    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
                }
            }

            return sourceUrl; 
        } catch (e) {
            console.error("Invalid URL passed to MediaPlayer", e);
            return '';
        }
    };

    const embedUrl = getEmbedUrl(url);

    if (!embedUrl) {
        return <div className="card-sketchy p-4 text-center">Media no disponible</div>;
    }

    return (
        <div className="w-full relative overflow-hidden card-sketchy bg-black" style={{ paddingTop: type === 'video' ? '56.25%' : '152px' }}>
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
            ></iframe>
        </div>
    );
};
