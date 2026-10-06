import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const sectionIds = ["about", "resume", "github", "social", "projects"];
export const songs = [
  "Jane Doe",
  "Mass Destruction -Reload-",
  "Color Your Night",
  "Full Moon Full Life",
  "When The Moon's Reaching Out Stars -Reload-",
];

export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function usePortfolio() {
  const [selected, setSelected] = useState("about");
  const [panel, setPanel] = useState("about");
  const [isMenu, setIsMenu] = useState(true);
  const [keyboardMenu, setKeyboardMenu] = useState(false);
  const [details, setDetails] = useState({ about: "bio", resume: "education" });
  const [libraryOpen, setLibraryOpen] = useState(false);
  const cards = useRef({});
  const back = useRef(null);
  const info = useRef(null);
  const musicToggle = useRef(null);
  const focusTarget = useRef(null);

  useLayoutEffect(() => {
    if (focusTarget.current === "back") {
      info.current.scrollTop = 0;
      back.current.focus({ preventScroll: true });
    } else if (focusTarget.current === "card") {
      cards.current[selected]?.focus({ preventScroll: true });
    }
    focusTarget.current = null;
  }, [selected, isMenu, panel]);

  const select = (id, focus = false) => {
    if (focus) focusTarget.current = "card";
    setSelected(id);
    if (focus && selected === id)
      cards.current[id]?.focus({ preventScroll: true });
  };

  const openPanel = (id) => {
    focusTarget.current = "back";
    setSelected(id);
    setPanel(id);
    setKeyboardMenu(false);
    setLibraryOpen(false);
    setIsMenu(false);
  };

  const returnToMenu = useCallback(() => {
    focusTarget.current = "card";
    setIsMenu(true);
    if (isMenu) cards.current[selected]?.focus({ preventScroll: true });
  }, [isMenu, selected]);

  const move = (key, id = selected) => {
    const index = sectionIds.indexOf(id);
    if (["ArrowDown", "Down"].includes(key))
      return sectionIds[(index + 1) % sectionIds.length];
    if (["ArrowUp", "Up"].includes(key))
      return sectionIds[(index + sectionIds.length - 1) % sectionIds.length];
    if (key === "Home") return sectionIds[0];
    if (key === "End") return sectionIds.at(-1);
    return null;
  };

  const cardKeyDown = (event, id) => {
    const next = move(event.key, id);
    if (!next) return;
    event.preventDefault();
    setKeyboardMenu(true);
    select(next, true);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (libraryOpen) {
          setLibraryOpen(false);
          musicToggle.current?.focus();
        } else returnToMenu();
      }
      if (
        isMenu &&
        event.target === document.body &&
        ["ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
        const index = sectionIds.indexOf(selected);
        const next =
          sectionIds[
            (index + (event.key === "ArrowDown" ? 1 : sectionIds.length - 1)) %
              sectionIds.length
          ];
        focusTarget.current = "card";
        setSelected(next);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenu, libraryOpen, selected, returnToMenu]);

  return {
    selected,
    panel,
    isMenu,
    keyboardMenu,
    details,
    setDetails,
    libraryOpen,
    setLibraryOpen,
    cards,
    back,
    info,
    musicToggle,
    select,
    openPanel,
    returnToMenu,
    cardKeyDown,
  };
}

export function useVideo() {
  const intro = useRef(null);
  const loop = useRef(null);
  const [looping, setLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const completionTimers = useRef([]);
  const canPlayHandled = useRef(false);
  const playLoop = useCallback(() => {
    setLooping(true);
    loop.current?.play().catch(() => {});
  }, []);
  const endLoading = useCallback(() => {
    setProgress(100);
    completionTimers.current.push(window.setTimeout(() => setDone(true), 450));
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      endLoading();
      playLoop();
    }, 8000);
    return () => {
      window.clearTimeout(timer);
      completionTimers.current.forEach(window.clearTimeout);
    };
  }, [endLoading, playLoop]);
  const updateProgress = (event) => {
    const video = event.currentTarget;
    if (Number.isFinite(video.duration))
      setProgress(
        Math.min(99, Math.round((video.currentTime / video.duration) * 100)),
      );
  };
  const canPlay = () => {
    if (canPlayHandled.current) return;
    canPlayHandled.current = true;
    endLoading();
  };
  return {
    intro,
    loop,
    looping,
    progress,
    done,
    endLoading,
    canPlay,
    playLoop,
    updateProgress,
  };
}

export function useMusic() {
  const audio = useRef(null);
  const [track, setTrack] = useState(0);
  const [label, setLabel] = useState("JANE DOE");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(NaN);
  const [volume, setVolume] = useState(0.65);
  const [muted, setMuted] = useState(false);
  const [note, setNote] = useState("ELIGE UNA PISTA Y PULSA PLAY");
  const playMusic = () =>
    audio.current.play().catch(() => {
      setPlaying(false);
      setNote("No se pudo reproducir. Prueba otra pista o pulsa play.");
    });
  useEffect(() => {
    audio.current.volume = volume;
    audio.current.muted = muted;
  }, [volume, muted]);
  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );
  const updateProgress = () => {
    setTime(audio.current.currentTime);
    setDuration(audio.current.duration);
  };
  const chooseTrack = (index) => {
    setTrack(index);
    setLabel(songs[index]);
    audio.current.src = encodeURI(`assets/audio/${songs[index]}.mp3`);
    audio.current.load();
    setTime(0);
    setDuration(NaN);
    playMusic();
  };
  const nextTrack = () => chooseTrack((track + 1) % songs.length);
  const previousTrack = () =>
    chooseTrack((track + songs.length - 1) % songs.length);
  const togglePlayback = () =>
    audio.current.paused ? playMusic() : audio.current.pause();
  const seek = (value) => {
    if (!Number.isFinite(audio.current.duration)) return;
    audio.current.currentTime = (Number(value) / 100) * audio.current.duration;
    updateProgress();
  };
  const progress =
    Number.isFinite(duration) && duration > 0 ? (time / duration) * 100 : 0;
  return {
    audio,
    track,
    label,
    playing,
    time,
    duration,
    volume,
    muted,
    note,
    progress,
    updateProgress,
    chooseTrack,
    nextTrack,
    previousTrack,
    togglePlayback,
    seek,
    changeVolume: (value) => {
      setVolume(Number(value) / 100);
      setMuted(false);
    },
    toggleMute: () => setMuted((value) => !value),
    onPlay: () => {
      setPlaying(true);
      setNote("REPRODUCIENDO / PAPOLO MUSIC");
    },
    onPause: () => {
      setPlaying(false);
      setNote("EN PAUSA / PAPOLO MUSIC");
    },
    onError: () => {
      setPlaying(false);
      setNote("Audio no disponible. Selecciona otra pista.");
    },
  };
}
