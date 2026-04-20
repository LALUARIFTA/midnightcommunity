'use strict';

/**
 * Midnight Community - Dynamic Background Video Handler
 * Supports HLS (.m3u8) and Standard (.mp4) switching based on scroll.
 */

let currentHls = null;
const VIDEO_DEFAULT = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
const VIDEO_HOF = 'https://stream.mux.com/BuGGTsiXq1T00WUb8qfURrHkTCbhrkfFLSv4uAOZzdhw.m3u8';
const VIDEO_JOIN = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260416_101255_3099d3e4-d0cf-4e59-9666-97fbf521ac71.mp4';

/**
 * Loads a new HLS or MP4 source into the video element with a smooth transition.
 */
function loadVideoSource(video, url) {
    if (video.dataset.currentUrl === url) return;
    
    // Fade out
    video.style.transition = 'opacity 0.6s ease';
    video.style.opacity = '0';

    setTimeout(() => {
        // Cleanup HLS
        if (currentHls) {
            currentHls.destroy();
            currentHls = null;
        }

        const isHls = url.includes('.m3u8');

        if (isHls && Hls.isSupported()) {
            const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: true });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().then(() => {
                    video.style.opacity = '0.8'; 
                }).catch(e => {});
            });
            currentHls = hls;
        } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.play().then(() => { video.style.opacity = '0.8'; }).catch(e => {});
        } else {
            // Standard MP4 handling
            video.src = url;
            video.load();
            video.play().then(() => {
                video.style.opacity = '0.8';
            }).catch(e => {});
        }
        
        video.dataset.currentUrl = url;
    }, 600);
}

function initBackgroundVideo() {
    const video = document.getElementById('video-bg');
    if (!video) return;

    // Initial Load
    loadVideoSource(video, VIDEO_DEFAULT);

    // Observer options
    const options = { threshold: 0.15, rootMargin: "-50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        // Track which sections are intersecting
        let intersectingId = null;
        
        // We evaluate based on which section is more prominent in view
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                intersectingId = entry.target.id;
            }
        });

        if (intersectingId === 'hof') {
            loadVideoSource(video, VIDEO_HOF);
        } else if (intersectingId === 'join') {
            loadVideoSource(video, VIDEO_JOIN);
        } else {
            // Determine if we should go back to default
            // This happens if we scroll above HOF or between sections
            const scrollY = window.scrollY;
            const hofElement = document.getElementById('hof');
            const joinElement = document.getElementById('join');
            
            if (hofElement && scrollY < hofElement.offsetTop - 300) {
                loadVideoSource(video, VIDEO_DEFAULT);
            }
        }
    }, options);

    // Observe specific sections
    const hof = document.getElementById('hof');
    const join = document.getElementById('join');
    if (hof) observer.observe(hof);
    if (join) observer.observe(join);
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundVideo);
} else {
    initBackgroundVideo();
}
