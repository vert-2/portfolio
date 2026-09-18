document.addEventListener("DOMContentLoaded", () => {
  // Elementos que controlan la transición entre videos y el indicador de carga.
  const intro = document.querySelector("#video-intro");
  const loop = document.querySelector("#video-loop");
  const stage = document.querySelector(".video-stage");
  const loader = document.querySelector(".loader");
  const personaApp = document.querySelector(".persona-app");
  const personaLogo = document.querySelector(".persona-logo");
  const progress = loader.querySelector("i");
  const percent = loader.querySelector("b");
  const cards = document.querySelectorAll(".persona-card");
  const panels = document.querySelectorAll(".panel-content");
  const musicPlayer = document.querySelector("#music-player");
  const musicToggle = document.querySelector("#music-toggle");
  const musicLibrary = document.querySelector("#music-library");
  const tracks = document.querySelectorAll(".track");
  const currentTracks = document.querySelectorAll(".current-track");
  const musicAudio = document.querySelector("#persona-player");
  const playbackToggle = document.querySelector("#playback-toggle");
  const playbackProgress = document.querySelector("#playback-progress");
  const currentTime = document.querySelector("#current-time");
  const trackDuration = document.querySelector("#track-duration");
  const nextTrack = document.querySelector("#next-track");

  // Finaliza visualmente la carga del video.
  const endLoading = () => {
    progress.style.setProperty("--progress", "100%");
    percent.textContent = "100";
    window.setTimeout(() => loader.classList.add("done"), 450);
  };

  // Cambia al video que se reproduce continuamente después de la introducción.
  const playLoop = () => {
    stage.classList.add("is-looping");
    loop.play().catch(() => {});
  };

  // Actualiza el porcentaje mientras se reproduce la introducción.
  intro.addEventListener("timeupdate", () => {
    if (!Number.isFinite(intro.duration)) return;
    const current = Math.min(
      99,
      Math.round((intro.currentTime / intro.duration) * 100),
    );
    progress.style.setProperty("--progress", `${current}%`);
    percent.textContent = String(current).padStart(2, "0");
  });
  intro.addEventListener("canplay", endLoading, { once: true });
  intro.addEventListener("ended", playLoop);
  window.setTimeout(() => {
    endLoading();
    playLoop();
  }, 8000);

  // Muestra el panel correspondiente a cada tarjeta del menú.
  cards.forEach((card) =>
    card.addEventListener("click", () => {
      const target = card.dataset.panel;
      cards.forEach((item) => item.classList.toggle("active", item === card));
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.content !== target;
      });
      personaApp.classList.remove("is-menu");
    }),
  );

  // El logo permite volver a la pantalla principal de selección.
  personaLogo.addEventListener("click", (event) => {
    event.preventDefault();
    personaApp.classList.add("is-menu");
  });

  // Abre o cierra el selector de canciones sin detener la música en curso.
  musicToggle.addEventListener("click", () => {
    const isOpen = musicToggle.getAttribute("aria-expanded") === "true";
    musicToggle.setAttribute("aria-expanded", String(!isOpen));
    musicLibrary.hidden = isOpen;
    musicPlayer.classList.toggle("is-open", !isOpen);
  });

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const updateProgress = () => {
    const percentage = musicAudio.duration
      ? (musicAudio.currentTime / musicAudio.duration) * 100
      : 0;

    playbackProgress.value = percentage;
    playbackProgress.style.setProperty("--track-progress", `${percentage}%`);
    currentTime.textContent = formatTime(musicAudio.currentTime);
  };

  const setPlaybackState = (isPlaying) => {
    playbackToggle.textContent = isPlaying ? "Ⅱ" : "▶";
    playbackToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pausar canción" : "Reproducir canción",
    );
    playbackToggle.classList.toggle("is-playing", isPlaying);
  };

  // Intenta iniciar la primera canción en cuanto el navegador tenga suficiente audio.
  // Algunos navegadores exigen una interacción antes de permitir audio automático.
  const startMusicOnLoad = () => {
    musicAudio.play().catch(() => setPlaybackState(false));
  };

  // Sincroniza los controles personalizados con el reproductor de audio.
  musicAudio.volume = 0.65;
  musicAudio.addEventListener("canplay", startMusicOnLoad, { once: true });
  document.addEventListener("pointerdown", startMusicOnLoad, { once: true });
  document.addEventListener("keydown", startMusicOnLoad, { once: true });
  musicAudio.addEventListener("loadedmetadata", () => {
    trackDuration.textContent = formatTime(musicAudio.duration);
    updateProgress();
  });
  musicAudio.addEventListener("timeupdate", updateProgress);
  musicAudio.addEventListener("play", () => setPlaybackState(true));
  musicAudio.addEventListener("pause", () => setPlaybackState(false));

  playbackToggle.addEventListener("click", () => {
    if (musicAudio.paused) musicAudio.play().catch(() => {});
    else musicAudio.pause();
  });

  playbackProgress.addEventListener("input", () => {
    if (!Number.isFinite(musicAudio.duration)) return;

    musicAudio.currentTime =
      (playbackProgress.value / 100) * musicAudio.duration;
    updateProgress();
  });

  // Carga y reproduce el archivo local correspondiente a la pista elegida.
  tracks.forEach((track) => {
    track.addEventListener("click", () => {
      tracks.forEach((item) => {
        item.classList.toggle("active", item === track);
        item.setAttribute("aria-pressed", String(item === track));
      });

      currentTracks.forEach((label) => {
        label.textContent = track.dataset.track;
      });
      musicAudio.src = encodeURI(track.dataset.source);
      musicAudio.load();
      musicAudio.play().catch(() => {});
    });
  });

  nextTrack.addEventListener("click", () => {
    const activeTrack = document.querySelector(".track.active");
    const currentIndex = Array.from(tracks).indexOf(activeTrack);
    const nextIndex = (currentIndex + 1) % tracks.length;
    tracks[nextIndex].click();
  });

  musicAudio.addEventListener("ended", () => nextTrack.click());
});
