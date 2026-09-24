document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias del DOM: fondo, navegación y reproductor.
  const intro = document.querySelector("#video-intro");
  const loop = document.querySelector("#video-loop");
  const stage = document.querySelector(".video-stage");
  const loader = document.querySelector(".loader");
  const personaApp = document.querySelector(".persona-app");
  const personaLogo = document.querySelector(".persona-logo");
  const progress = loader.querySelector("i");
  const percent = loader.querySelector("b");
  const cards = document.querySelectorAll(".persona-card");
  const cardList = Array.from(cards);
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
  const previousTrack = document.querySelector("#previous-track");
  const volume = document.querySelector("#music-volume");
  const muteToggle = document.querySelector("#mute-toggle");
  const musicNote = document.querySelector(".music-note");
  // Mantiene los controles visibles cuando la lista de canciones está cerrada.
  musicPlayer.append(
    document.querySelector(".audio-console"),
    document.querySelector(".volume-console"),
    musicNote,
  );

  // 2. Carga inicial y transición entre los videos de fondo.
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

  // 3. Menú principal: selección con mouse y teclado.
  // Mantiene una selección única y una navegación de teclado predecible.
  let selectedCard =
    cardList.find((card) => card.classList.contains("active")) || cardList[0];
  const syncCardState = (card) => {
    selectedCard = card;
    cardList.forEach((item) => {
      const isActive = item === card;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
      if (isActive) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  };

  syncCardState(selectedCard);

  // Muestra el panel correspondiente a cada tarjeta del menú.
  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      if (personaApp.classList.contains("is-menu")) syncCardState(card);
    });
    card.addEventListener("click", () => {
      const target = card.dataset.panel;
      personaApp.classList.remove("keyboard-menu");
      syncCardState(card);
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.content !== target;
      });
      personaApp.classList.remove("is-menu");
      document.querySelector(".back-menu").focus({ preventScroll: true });
    });

    card.addEventListener("keydown", (event) => {
      if (!cardList.length) return;

      const currentIndex = cardList.indexOf(card);
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown" || event.key === "Down") {
        nextIndex = (currentIndex + 1) % cardList.length;
      } else if (event.key === "ArrowUp" || event.key === "Up") {
        nextIndex = (currentIndex - 1 + cardList.length) % cardList.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = cardList.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const nextCard = cardList[nextIndex];
      personaApp.classList.add("keyboard-menu");
      syncCardState(nextCard);
      nextCard.focus({ preventScroll: true });
    });
  });

  // 4. Regreso al menú y atajos globales.
  // El logo permite volver a la pantalla principal de selección.
  personaLogo.addEventListener("click", (event) => {
    event.preventDefault();
    personaApp.classList.add("is-menu");
    selectedCard?.focus({ preventScroll: true });
  });

  const returnToMenu = () => {
    personaApp.classList.add("is-menu");
    selectedCard?.focus({ preventScroll: true });
  };
  document.querySelector(".back-menu").addEventListener("click", returnToMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!musicLibrary.hidden) {
        musicLibrary.hidden = true;
        musicToggle.setAttribute("aria-expanded", "false");
        musicPlayer.classList.remove("is-open");
        musicToggle.focus();
      } else returnToMenu();
    }
    if (
      personaApp.classList.contains("is-menu") &&
      (event.target === document.body || event.target === personaLogo) &&
      ["ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      const next =
        cardList[
          (cardList.indexOf(selectedCard) + offset + cardList.length) %
            cardList.length
        ];
      syncCardState(next);
      next.focus({ preventScroll: true });
    }
  });
  // 5. Submenús de las secciones del portafolio.
  document.querySelectorAll(".section-switcher button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.closest(".panel-content");
      panel
        .querySelectorAll("[data-detail]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      panel.querySelectorAll("[data-detail-content]").forEach((item) => {
        item.hidden = item.dataset.detailContent !== button.dataset.detail;
      });
    });
  });

  // 6. Reproductor: lista, tiempos y estado de reproducción.
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

  // Inicia la reproducción desde los controles y muestra los errores.
  const playMusic = () =>
    musicAudio.play().catch(() => {
      setPlaybackState(false);
      musicNote.textContent =
        "No se pudo reproducir. Prueba otra pista o pulsa play.";
    });

  // Sincroniza los controles personalizados con el reproductor de audio.
  musicAudio.volume = 0.65;
  musicAudio.addEventListener("loadedmetadata", () => {
    trackDuration.textContent = formatTime(musicAudio.duration);
    updateProgress();
  });
  musicAudio.addEventListener("timeupdate", updateProgress);
  musicAudio.addEventListener("play", () => {
    setPlaybackState(true);
    musicNote.textContent = "REPRODUCIENDO / LEO MUSIC";
  });
  musicAudio.addEventListener("pause", () => {
    setPlaybackState(false);
    musicNote.textContent = "EN PAUSA / LEO MUSIC";
  });

  playbackToggle.addEventListener("click", () => {
    if (musicAudio.paused) playMusic();
    else musicAudio.pause();
  });

  playbackProgress.addEventListener("input", () => {
    if (!Number.isFinite(musicAudio.duration)) return;

    musicAudio.currentTime =
      (playbackProgress.value / 100) * musicAudio.duration;
    updateProgress();
  });

  // 7. Selección de canciones y controles anterior/siguiente.
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
      currentTime.textContent = "00:00";
      trackDuration.textContent = "--:--";
      playbackProgress.value = 0;
      playMusic();
    });
  });

  nextTrack.addEventListener("click", () => {
    const activeTrack = document.querySelector(".track.active");
    const currentIndex = Array.from(tracks).indexOf(activeTrack);
    const nextIndex = (currentIndex + 1) % tracks.length;
    tracks[nextIndex].click();
  });

  musicAudio.addEventListener("ended", () => nextTrack.click());
  previousTrack.addEventListener("click", () => {
    const index = Array.from(tracks).indexOf(
      document.querySelector(".track.active"),
    );
    tracks[(index - 1 + tracks.length) % tracks.length].click();
  });
  // 8. Volumen, silencio y errores de audio.
  const updateVolume = () => {
    const value = musicAudio.muted ? 0 : Math.round(musicAudio.volume * 100);
    volume.value = value;
    document.querySelector("#volume-value").textContent = `${value}%`;
    muteToggle.setAttribute("aria-pressed", String(musicAudio.muted));
    muteToggle.setAttribute(
      "aria-label",
      musicAudio.muted ? "Activar sonido" : "Silenciar",
    );
    muteToggle.textContent = musicAudio.muted ? "×" : "♪";
  };
  volume.addEventListener("input", () => {
    musicAudio.volume = Number(volume.value) / 100;
    musicAudio.muted = false;
    updateVolume();
  });
  muteToggle.addEventListener("click", () => {
    musicAudio.muted = !musicAudio.muted;
    updateVolume();
  });
  musicAudio.addEventListener("error", () => {
    musicNote.textContent = "Audio no disponible. Selecciona otra pista.";
    setPlaybackState(false);
  });
});
