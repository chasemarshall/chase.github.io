        // Local music player logic
        let playlist = [];
        let currentTrack = 0;
        let isPlaying = false;
let audioPlayer = document.getElementById('audioPlayer');

async function getAlbumArt(file) {
    return new Promise((resolve) => {
        if (window.jsmediatags) {
            window.jsmediatags.read(file, {
                onSuccess: function(tag) {
                    const picture = tag.tags.picture;
                    if (picture) {
                        let base64String = "";
                        for (let i = 0; i < picture.data.length; i++) {
                            base64String += String.fromCharCode(picture.data[i]);
                        }
                        const base64 = `data:${picture.format};base64,${btoa(base64String)}`;
                        resolve(base64);
                    } else {
                        resolve(null);
                    }
                },
                onError: function() { resolve(null); }
            });
        } else {
            resolve(null);
        }
    });
}

        async function loadPlaylist() {
            try {
                const response = await fetch('music/playlist.json');
                playlist = await response.json();
                await showTrack(currentTrack);
            } catch (error) {
                document.getElementById('trackName').textContent = 'playlist error';
                document.getElementById('trackArtist').textContent = '';
            }
        }

        async function showTrack(index) {
            if (!playlist.length) return;
            const track = playlist[index];
            document.getElementById('trackName').textContent = track.name;
            document.getElementById('trackArtist').textContent = track.artist;
            if (track.albumArt) {
                document.getElementById('albumArtContainer').innerHTML = `<img src="${track.albumArt}" class="album-art" alt="Album Art">`;
            } else {
                const art = await getAlbumArt(track.file);
                if (art) {
                    document.getElementById('albumArtContainer').innerHTML = `<img src="${art}" class="album-art" alt="Album Art">`;
                    track.albumArt = art;
                } else {
                    document.getElementById('albumArtContainer').innerHTML = '🎵';
                }
            }
            audioPlayer.src = track.file;
            audioPlayer.load();
            document.getElementById('playBtn').textContent = '▶';
            isPlaying = false;
            document.querySelector('.music-player').classList.remove('playing');
            document.getElementById('duration').textContent = '0:00';
            document.getElementById('currentTime').textContent = '0:00';
            document.getElementById('progress').style.width = '0%';
            document.getElementById('floatingText').textContent = `♪ ${track.name}`;
        }

        async function nextTrack(autoPlay = false) {
            const shouldPlay = isPlaying || autoPlay;
            currentTrack = (currentTrack + 1) % playlist.length;
            await showTrack(currentTrack);
            if (shouldPlay) playTrack();
        }

        async function previousTrack() {
            const shouldPlay = isPlaying;
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            await showTrack(currentTrack);
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
        const volume = document.getElementById('volumeSlider');
        if (volume) {
            volume.addEventListener('input', function() {
                audioPlayer.volume = this.value;
            });
            audioPlayer.volume = volume.value;
        }
        playTrack();
    }
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

