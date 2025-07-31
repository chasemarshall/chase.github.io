        // Local music player logic
        let playlist = [];
        let currentTrack = 0;
        let isPlaying = false;
        let audioPlayer = document.getElementById('audioPlayer');

        if (!audioPlayer) {
            audioPlayer = document.createElement('audio');
            audioPlayer.id = 'audioPlayer';
            audioPlayer.style.display = 'none';
            document.body.appendChild(audioPlayer);
        }

        const savedState = JSON.parse(sessionStorage.getItem('playerState') || '{}');

        async function loadPlaylist() {
            try {
                const response = await fetch('music/playlist.json');
                playlist = await response.json();
            } catch (error) {
                const nameEl = document.getElementById('trackName');
                if (nameEl) {
                    nameEl.textContent = 'playlist error';
                    const artistEl = document.getElementById('trackArtist');
                    if (artistEl) artistEl.textContent = '';
                }
                document.getElementById('floatingText').textContent = 'playlist error';
            }
        }

        function showTrack(index) {
            if (!playlist.length) return;
            const track = playlist[index];

            const nameEl = document.getElementById('trackName');
            if (nameEl) nameEl.textContent = track.name;

            const artistEl = document.getElementById('trackArtist');
            if (artistEl) artistEl.textContent = track.artist;

            const artEl = document.getElementById('albumArtContainer');
            if (artEl) {
                artEl.innerHTML = track.albumArt
                    ? `<img src="${track.albumArt}" class="album-art" alt="Album Art">`
                    : '🎵';
            }

            audioPlayer.src = track.file;
            audioPlayer.load();

            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.textContent = '▶';
            isPlaying = false;

            const playerEl = document.querySelector('.music-player');
            if (playerEl) playerEl.classList.remove('playing');

            const durationEl = document.getElementById('duration');
            if (durationEl) durationEl.textContent = '0:00';

            const currentTimeEl = document.getElementById('currentTime');
            if (currentTimeEl) currentTimeEl.textContent = '0:00';

            const progressEl = document.getElementById('progress');
            if (progressEl) progressEl.style.width = '0%';

            document.getElementById('floatingText').textContent = `♪ ${track.name}`;
        }

        function nextTrack(autoPlay = false) {
            const shouldPlay = isPlaying || autoPlay;
            currentTrack = (currentTrack + 1) % playlist.length;
            showTrack(currentTrack);
            if (shouldPlay) playTrack();
        }

        function previousTrack(autoPlay = false) {
            const shouldPlay = isPlaying || autoPlay;
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            showTrack(currentTrack);
            if (shouldPlay) playTrack();
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
        }

        function pauseTrack() {
            audioPlayer.pause();
            isPlaying = false;
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.textContent = '▶';
            const playerEl = document.querySelector('.music-player');
            if (playerEl) playerEl.classList.remove('playing');
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
            const progressEl = document.getElementById('progress');
            const currentEl = document.getElementById('currentTime');
            const durationEl = document.getElementById('duration');
            if (!progressEl || !currentEl || !durationEl) return;

            function updateProgress() {
                if (!isPlaying || audioPlayer.paused) return;
                const currentTime = audioPlayer.currentTime;
                const duration = audioPlayer.duration;
                if (duration && !isNaN(duration)) {
                    const progressPercent = (currentTime / duration) * 100;
                    progressEl.style.width = progressPercent + '%';
                    currentEl.textContent = formatTime(currentTime);
                    durationEl.textContent = formatTime(duration);
                }
                requestAnimationFrame(updateProgress);
            }
            requestAnimationFrame(updateProgress);
        }

        function seekTo(event) {
            if (!audioPlayer.src || !audioPlayer.duration) return;
            const progressBar = event.currentTarget;
            if (!progressBar) return;
            const clickX = event.offsetX;
            const width = progressBar.offsetWidth;
            const percentage = clickX / width;
            audioPlayer.currentTime = percentage * audioPlayer.duration;
        }

        audioPlayer.addEventListener('play', startProgressAnimation);
        audioPlayer.addEventListener('ended', function() {
            nextTrack(true);
        });

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
    await loadPlaylist();

    if (savedState.currentTrack !== undefined) {
        currentTrack = savedState.currentTrack;
    }

    showTrack(currentTrack);

    if (savedState.currentTime) {
        audioPlayer.currentTime = savedState.currentTime;
    }

    const volume = document.getElementById('volumeSlider');
    if (volume) {
        volume.addEventListener('input', function() {
            audioPlayer.volume = this.value;
        });
        audioPlayer.volume = volume.value;
    }

    if (savedState.isPlaying !== false) {
        playTrack();
    }

    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('playerState', JSON.stringify({
            currentTrack,
            currentTime: audioPlayer.currentTime,
            isPlaying
        }));
    });
    // Simulate typing effect for the title
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

