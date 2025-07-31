        // Local music player logic
        const stateKey = 'playerState';
        let playlist = [];
        let currentTrack = 0;
        let isPlaying = false;
        const audioPlayer = document.getElementById('audioPlayer');

        async function loadPlaylist() {
            try {
                const response = await fetch('music/playlist.json');
                playlist = await response.json();
            } catch (error) {
                playlist = [];
                document.getElementById('trackName').textContent = 'playlist error';
                document.getElementById('trackArtist').textContent = '';
            }
        }

        function showTrack(index) {
            if (!playlist.length) return;
            const track = playlist[index];
            document.getElementById('trackName').textContent = track.name;
            document.getElementById('trackArtist').textContent = track.artist;
            document.getElementById('albumArtContainer').innerHTML = track.albumArt
                ? `<img src="${track.albumArt}" class="album-art" alt="Album Art">`
                : '🎵';
            audioPlayer.src = track.file;
            audioPlayer.load();
            document.getElementById('playBtn').textContent = '▶';
            document.querySelector('.music-player').classList.remove('playing');
            document.getElementById('duration').textContent = '0:00';
            document.getElementById('currentTime').textContent = '0:00';
            document.getElementById('progress').style.width = '0%';
            document.getElementById('floatingText').textContent = `♪ ${track.name}`;
            isPlaying = false;
        }

        function nextTrack(autoPlay = false) {
            const wasPlaying = isPlaying;
            currentTrack = (currentTrack + 1) % playlist.length;
            showTrack(currentTrack);
            if (wasPlaying || autoPlay) playTrack();
        }

        function previousTrack() {
            const wasPlaying = isPlaying;
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            showTrack(currentTrack);
            if (wasPlaying) playTrack();
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
            document.getElementById('playBtn').textContent = '⏸';
            document.querySelector('.music-player').classList.add('playing');
        }

        function pauseTrack() {
            audioPlayer.pause();
            isPlaying = false;
            document.getElementById('playBtn').textContent = '▶';
            document.querySelector('.music-player').classList.remove('playing');
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
                if (duration && !isNaN(duration)) {
                    const progressPercent = (currentTime / duration) * 100;
                    document.getElementById('progress').style.width = progressPercent + '%';
                    document.getElementById('currentTime').textContent = formatTime(currentTime);
                    document.getElementById('duration').textContent = formatTime(duration);
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
            });
        }

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

