// Local music player logic
let playlist = [];
let currentTrack = 0;
let isPlaying = false;
const audioPlayer = document.getElementById('audioPlayer');
let initialState = {};

async function loadPlaylist() {
    try {
        const response = await fetch('music/playlist.json');
        playlist = await response.json();
    } catch (error) {
        if (document.getElementById('trackName')) {
            document.getElementById('trackName').textContent = 'playlist error';
            document.getElementById('trackArtist').textContent = '';
        }
        const floatText = document.getElementById('floatingText');
        if (floatText) floatText.textContent = 'playlist error';
    }
}

function restoreState() {
    try {
        initialState = JSON.parse(localStorage.getItem('playerState')) || {};
    } catch (e) {
        initialState = {};
    }
    if (initialState.track !== undefined && playlist.length) {
        currentTrack = initialState.track % playlist.length;
    }
    if (audioPlayer) {
        if (initialState.volume !== undefined) {
            audioPlayer.volume = initialState.volume;
        }
        const volEl = document.getElementById('volumeSlider');
        if (volEl) {
            volEl.value = audioPlayer.volume;
        }
    }
    return initialState;
}

function saveState() {
    if (!audioPlayer) return;
    localStorage.setItem('playerState', JSON.stringify({
        track: currentTrack,
        time: audioPlayer.currentTime,
        volume: audioPlayer.volume,
        isPlaying: isPlaying
    }));
}

function showTrack(index) {
    if (!playlist.length) return;
    const track = playlist[index];
    const nameEl = document.getElementById('trackName');
    const artistEl = document.getElementById('trackArtist');
    const artEl = document.getElementById('albumArtContainer');
    if (nameEl) nameEl.textContent = track.name;
    if (artistEl) artistEl.textContent = track.artist;
    if (artEl) {
        artEl.innerHTML = track.albumArt
            ? `<img src="${track.albumArt}" class="album-art" alt="Album Art">`
            : '🎵';
    }
    if (audioPlayer) {
        audioPlayer.src = track.file;
        audioPlayer.load();
    }
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.textContent = '▶';
    isPlaying = false;
    const playerEl = document.querySelector('.music-player');
    if (playerEl) playerEl.classList.remove('playing');
    const durEl = document.getElementById('duration');
    const curEl = document.getElementById('currentTime');
    if (durEl) durEl.textContent = '0:00';
    if (curEl) curEl.textContent = '0:00';
    const progEl = document.getElementById('progress');
    if (progEl) progEl.style.width = '0%';
    const floatText = document.getElementById('floatingText');
    if (floatText) floatText.textContent = `♪ ${track.name}`;
}

function nextTrack(autoPlay = true) {
    const shouldPlay = isPlaying || autoPlay;
    currentTrack = (currentTrack + 1) % playlist.length;
    showTrack(currentTrack);
    if (shouldPlay) playTrack();
    saveState();
}

function previousTrack(autoPlay = true) {
    const shouldPlay = isPlaying || autoPlay;
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    showTrack(currentTrack);
    if (shouldPlay) playTrack();
    saveState();
}

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return min + ':' + (sec < 10 ? '0' : '') + sec;
}

function playTrack() {
    audioPlayer.play();
    isPlaying = true;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.textContent = '⏸';
    const playerEl = document.querySelector('.music-player');
    if (playerEl) playerEl.classList.add('playing');
    saveState();
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.textContent = '▶';
    const playerEl = document.querySelector('.music-player');
    if (playerEl) playerEl.classList.remove('playing');
    saveState();
}

function togglePlay() {
    if (!audioPlayer || !audioPlayer.src) return;
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function startProgressAnimation() {
    function updateProgress() {
        if (!isPlaying || audioPlayer.paused) return;
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        if (duration && !isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            const progEl = document.getElementById('progress');
            const curEl = document.getElementById('currentTime');
            const durEl = document.getElementById('duration');
            if (progEl) progEl.style.width = progressPercent + '%';
            if (curEl) curEl.textContent = formatTime(currentTime);
            if (durEl) durEl.textContent = formatTime(duration);
        }
        requestAnimationFrame(updateProgress);
    }
    requestAnimationFrame(updateProgress);
}

function seekTo(event) {
    if (!audioPlayer || !audioPlayer.src || !audioPlayer.duration) return;
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    const percentage = clickX / width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
    saveState();
}

if (audioPlayer) {
    audioPlayer.addEventListener('play', startProgressAnimation);
    audioPlayer.addEventListener('ended', function () { nextTrack(true); });
    audioPlayer.addEventListener('timeupdate', saveState);
    audioPlayer.addEventListener('play', saveState);
    audioPlayer.addEventListener('pause', saveState);
}
window.addEventListener('beforeunload', saveState);

// Project links
function openProject(projectId) {
    const projectUrls = {
        'project1': 'https://github.com/chasemarshall/minimal-ui-kit',
        'project2': 'https://github.com/chasemarshall/dotfiles',
        'project3': 'https://github.com/chasemarshall/markdown-blog-engine',
        'project4': 'https://github.com/chasemarshall/color-palette-generator'
    };
    window.open(projectUrls[projectId], '_blank');
}

// Initialize
document.addEventListener('DOMContentLoaded', async function () {
    await loadPlaylist();
    restoreState();
    showTrack(currentTrack);
    if (audioPlayer) {
        const volume = document.getElementById('volumeSlider');
        if (volume) {
            volume.addEventListener('input', function () {
                audioPlayer.volume = parseFloat(this.value);
                saveState();
            });
        }
        audioPlayer.addEventListener('loadedmetadata', function () {
            audioPlayer.currentTime = initialState.time || 0;
            if (initialState.isPlaying !== false) {
                playTrack();
            }
        }, { once: true });
    }
    const title = document.querySelector('h1');
    const originalText = title.textContent;
    title.textContent = '';
    let i = 0;
    const typeWriter = setInterval(() => {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeWriter);
        }
    }, 100);
});

