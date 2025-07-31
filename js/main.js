        // Local music player logic
        const stateKey = 'playerState';
        let playlist = [];
        let currentTrack = 0;
        let isPlaying = false;
        const audioPlayer = document.getElementById('audioPlayer');

        function getEl(id) {
            return document.getElementById(id);
        }

        async function loadPlaylist() {
            try {
                const response = await fetch('./music/playlist.json');
                playlist = await response.json();
            } catch (error) {
                playlist = [];
                console.error('Failed to load playlist', error);
                const nameEl = document.getElementById('trackName');
                const artistEl = document.getElementById('trackArtist');
                if (nameEl) nameEl.textContent = 'playlist error';
                if (artistEl) artistEl.textContent = '';
            }
        }

        function showTrack(index) {
            if (!playlist.length) return;
            const track = playlist[index];
            const nameEl = getEl('trackName');
            const artistEl = getEl('trackArtist');
            const artEl = getEl('albumArtContainer');
            const playBtn = getEl('playBtn');
            const mp = document.querySelector('.music-player');
            const durationEl = getEl('duration');
            const currentEl = getEl('currentTime');
            const progressEl = getEl('progress');

            if (nameEl) nameEl.textContent = track.name;
            if (artistEl) artistEl.textContent = track.artist;
            if (artEl) {
                artEl.innerHTML = track.albumArt
                    ? `<img src="${track.albumArt}" class="album-art" alt="Album Art">`
                    : '🎵';
            }
            audioPlayer.src = track.file;
            audioPlayer.load();
            if (playBtn) playBtn.textContent = '▶';
            if (mp) mp.classList.remove('playing');
            if (durationEl) durationEl.textContent = '0:00';
            if (currentEl) currentEl.textContent = '0:00';
            if (progressEl) progressEl.style.width = '0%';
            const floating = getEl('floatingText');
            if (floating) floating.textContent = `♪ ${track.name}`;
            isPlaying = false;
        }

        function nextTrack(autoPlay = false) {
            const wasPlaying = isPlaying;
            currentTrack = (currentTrack + 1) % playlist.length;
            showTrack(currentTrack);
            if (wasPlaying || autoPlay) playTrack();
            saveState();
        }

        function previousTrack() {
            const wasPlaying = isPlaying;
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            showTrack(currentTrack);
            if (wasPlaying) playTrack();
            saveState();
        }

        function formatTime(seconds) {
            seconds = Math.floor(seconds);
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            return min + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function playTrack() {
            const playBtn = getEl('playBtn');
            const mp = document.querySelector('.music-player');
            audioPlayer.play().catch(() => {});
            isPlaying = true;
            if (playBtn) playBtn.textContent = '⏸';
            if (mp) mp.classList.add('playing');
            saveState();
        }

        function pauseTrack() {
            const playBtn = getEl('playBtn');
            const mp = document.querySelector('.music-player');
            audioPlayer.pause();
            isPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
            if (mp) mp.classList.remove('playing');
            saveState();
        }

        function togglePlay() {
            if (!audioPlayer.src) return;
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
                const progressEl = getEl('progress');
                const currentEl = getEl('currentTime');
                const durationEl = getEl('duration');
                if (duration && !isNaN(duration)) {
                    const progressPercent = (currentTime / duration) * 100;
                    if (progressEl) progressEl.style.width = progressPercent + '%';
                    if (currentEl) currentEl.textContent = formatTime(currentTime);
                    if (durationEl) durationEl.textContent = formatTime(duration);
                }
                requestAnimationFrame(updateProgress);
            }
            requestAnimationFrame(updateProgress);
        }

        function seekTo(event) {
            if (!audioPlayer.src || !audioPlayer.duration) return;
            const progressBar = event.currentTarget;
            const clickX = event.offsetX;
            const width = progressBar.offsetWidth;
            const percentage = clickX / width;
            audioPlayer.currentTime = percentage * audioPlayer.duration;
        }

        audioPlayer.addEventListener('play', startProgressAnimation);
        audioPlayer.addEventListener('ended', function() {
            nextTrack(true);
        });

        function saveState() {
            if (!audioPlayer) return;
            const state = {
                track: currentTrack,
                time: audioPlayer.currentTime,
                volume: audioPlayer.volume,
                playing: isPlaying
            };
            localStorage.setItem(stateKey, JSON.stringify(state));
        }

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
document.addEventListener('DOMContentLoaded', async function() {
    if (audioPlayer) {
        await loadPlaylist();
        const saved = localStorage.getItem(stateKey);
        if (saved) {
            try {
                const state = JSON.parse(saved);
                currentTrack = state.track || 0;
                showTrack(currentTrack);
                audioPlayer.addEventListener('loadedmetadata', function restore() {
                    audioPlayer.currentTime = state.time || 0;
                    audioPlayer.removeEventListener('loadedmetadata', restore);
                });
                if (state.volume !== undefined) {
                    audioPlayer.volume = state.volume;
                    const volumeSlider = document.getElementById('volumeSlider');
                    if (volumeSlider) volumeSlider.value = state.volume;
                }
                if (state.playing) playTrack();
            } catch (e) {
                showTrack(0);
            }
        } else {
            showTrack(currentTrack);
        }

        const volume = document.getElementById('volumeSlider');
        if (volume) {
            volume.addEventListener('input', function() {
                audioPlayer.volume = this.value;
                saveState();
            });
        }

        audioPlayer.addEventListener('timeupdate', saveState);
        audioPlayer.addEventListener('volumechange', saveState);

        window.addEventListener('beforeunload', saveState);
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

