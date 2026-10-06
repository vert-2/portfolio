import {
  formatTime,
  useMusic,
  usePortfolio,
  useVideo,
} from "../hooks/usePortfolio.js";

export default function App() {
  const nav = usePortfolio();
  const video = useVideo();
  const music = useMusic();
  return (
    <>
      {/* Fondo animado e introducción. */}
      <div
        className={`video-stage${video.looping ? " is-looping" : ""}`}
        aria-hidden="true"
      >
        <video
          ref={video.intro}
          onCanPlay={video.canPlay}
          onEnded={video.playLoop}
          onTimeUpdate={video.updateProgress}
          id="video-intro"
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source src="assets/video/Intro.mp4" type="video/mp4" />
        </video>
        <video
          ref={video.loop}
          id="video-loop"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="assets/video/loop.mp4" type="video/mp4" />
        </video>
        <div className="blue-wash"></div>
        <div className="screen-lines"></div>
      </div>

      <main
        className={`persona-app${nav.isMenu ? " is-menu" : ""}${nav.keyboardMenu ? " keyboard-menu" : ""}`}
      >
        <section className="hero-ui" aria-label="Navegación del portfolio">
          {/* Menú principal: cada data-panel corresponde a un data-content. */}
          <nav className="persona-nav" aria-label="Secciones">
            <button
              className={`persona-card${nav.selected === "about" ? " active" : ""}`}
              type="button"
              data-panel="about"
              aria-controls="panel-about"
              aria-pressed={nav.selected === "about"}
              tabIndex={nav.selected === "about" ? 0 : -1}
              aria-current={nav.selected === "about" ? "page" : undefined}
              ref={(element) => {
                nav.cards.current["about"] = element;
              }}
              onPointerEnter={() => {
                if (nav.isMenu) nav.select("about");
              }}
              onClick={() => nav.openPanel("about")}
              onKeyDown={(event) => nav.cardKeyDown(event, "about")}
            >
              <span>ABOUT ME</span>
              <em className="selection-ink" aria-hidden="true">
                <span>ABOUT ME</span>
              </em>
            </button>
            <button
              className={`persona-card${nav.selected === "resume" ? " active" : ""}`}
              type="button"
              data-panel="resume"
              aria-controls="panel-resume"
              aria-pressed={nav.selected === "resume"}
              tabIndex={nav.selected === "resume" ? 0 : -1}
              aria-current={nav.selected === "resume" ? "page" : undefined}
              ref={(element) => {
                nav.cards.current["resume"] = element;
              }}
              onPointerEnter={() => {
                if (nav.isMenu) nav.select("resume");
              }}
              onClick={() => nav.openPanel("resume")}
              onKeyDown={(event) => nav.cardKeyDown(event, "resume")}
            >
              <span>RESUME</span>
              <em className="selection-ink" aria-hidden="true">
                <span>RESUME</span>
              </em>
            </button>
            <button
              className={`persona-card${nav.selected === "github" ? " active" : ""}`}
              type="button"
              data-panel="github"
              aria-controls="panel-github"
              aria-pressed={nav.selected === "github"}
              tabIndex={nav.selected === "github" ? 0 : -1}
              aria-current={nav.selected === "github" ? "page" : undefined}
              ref={(element) => {
                nav.cards.current["github"] = element;
              }}
              onPointerEnter={() => {
                if (nav.isMenu) nav.select("github");
              }}
              onClick={() => nav.openPanel("github")}
              onKeyDown={(event) => nav.cardKeyDown(event, "github")}
            >
              <span>GITHUB LINK</span>
              <em className="selection-ink" aria-hidden="true">
                <span>GITHUB LINK</span>
              </em>
            </button>
            <button
              className={`persona-card${nav.selected === "social" ? " active" : ""}`}
              type="button"
              data-panel="social"
              aria-controls="panel-social"
              aria-pressed={nav.selected === "social"}
              tabIndex={nav.selected === "social" ? 0 : -1}
              aria-current={nav.selected === "social" ? "page" : undefined}
              ref={(element) => {
                nav.cards.current["social"] = element;
              }}
              onPointerEnter={() => {
                if (nav.isMenu) nav.select("social");
              }}
              onClick={() => nav.openPanel("social")}
              onKeyDown={(event) => nav.cardKeyDown(event, "social")}
            >
              <span>SOCIALS</span>
              <em className="selection-ink" aria-hidden="true">
                <span>SOCIALS</span>
              </em>
            </button>
            <button
              className={`persona-card${nav.selected === "projects" ? " active" : ""}`}
              type="button"
              data-panel="projects"
              aria-controls="panel-projects"
              aria-pressed={nav.selected === "projects"}
              tabIndex={nav.selected === "projects" ? 0 : -1}
              aria-current={nav.selected === "projects" ? "page" : undefined}
              ref={(element) => {
                nav.cards.current["projects"] = element;
              }}
              onPointerEnter={() => {
                if (nav.isMenu) nav.select("projects");
              }}
              onClick={() => nav.openPanel("projects")}
              onKeyDown={(event) => nav.cardKeyDown(event, "projects")}
            >
              <span>SIDE PROJECTS</span>
              <em className="selection-ink" aria-hidden="true">
                <span>SIDE PROJECTS</span>
              </em>
            </button>
          </nav>

          {/* Contenido de las secciones y sus submenús. */}
          <aside ref={nav.info} className="info-panel" aria-live="polite">
            <button
              ref={nav.back}
              onClick={nav.returnToMenu}
              className="back-menu"
              type="button"
            >
              ← VOLVER <small>ESC</small>
            </button>
            <p className="panel-eyebrow">STATUS // ACTIVE</p>
            <div
              id="panel-about"
              className="panel-content"
              data-content="about"
              hidden={nav.panel !== "about"}
            >
              <h2>
                ABOUT
                <br />
                ME
              </h2>
              <p>
                Leopoldo Rodríguez Fernández · Estudiante con interés en
                programación y experiencia en ventas y atención al cliente.
              </p>
              <div className="stats">
                <span>
                  <b>01</b> APRENDIZAJE CONTINUO
                </span>
                <span>
                  <b>02</b> TRABAJO EN EQUIPO
                </span>
              </div>
              <div className="section-switcher" aria-label="Perfil de Leo">
                <button
                  type="button"
                  data-detail="bio"
                  aria-pressed={nav.details.about === "bio"}
                  onClick={() =>
                    nav.setDetails((current) => ({ ...current, about: "bio" }))
                  }
                >
                  01 / ABOUT ME
                </button>
                <button
                  type="button"
                  data-detail="interests"
                  aria-pressed={nav.details.about === "interests"}
                  onClick={() =>
                    nav.setDetails((current) => ({
                      ...current,
                      about: "interests",
                    }))
                  }
                >
                  02 / INTERESTS
                </button>
              </div>
              <p data-detail-content="bio" hidden={nav.details.about !== "bio"}>
                Soy una persona responsable y proactiva, con habilidades de
                comunicación, trabajo en equipo y resolución de problemas. Mi
                experiencia comercial me ha permitido desarrollar relaciones con
                clientes y colaborar en el cumplimiento de objetivos. Me adapto
                a nuevos retos con iniciativa y una actitud positiva, y disfruto
                ampliar mis conocimientos a través de la programación y la
                creación de proyectos.
              </p>
              <p
                data-detail-content="interests"
                hidden={nav.details.about !== "interests"}
              >
                Me gusta programar, escuchar música y jugar ajedrez. La
                programación me permite crear soluciones y seguir aprendiendo;
                la música forma parte de mi día a día y el ajedrez es una de mis
                actividades favoritas.
              </p>
            </div>
            <div
              id="panel-resume"
              className="panel-content"
              data-content="resume"
              hidden={nav.panel !== "resume"}
            >
              <h2>RESUME</h2>
              <div className="section-switcher" aria-label="Currículum de Leo">
                <button
                  type="button"
                  data-detail="education"
                  aria-pressed={nav.details.resume === "education"}
                  onClick={() =>
                    nav.setDetails((current) => ({
                      ...current,
                      resume: "education",
                    }))
                  }
                >
                  I / EDUCATION
                </button>
                <button
                  type="button"
                  data-detail="skills"
                  aria-pressed={nav.details.resume === "skills"}
                  onClick={() =>
                    nav.setDetails((current) => ({
                      ...current,
                      resume: "skills",
                    }))
                  }
                >
                  II / SKILLS
                </button>
                <button
                  type="button"
                  data-detail="work"
                  aria-pressed={nav.details.resume === "work"}
                  onClick={() =>
                    nav.setDetails((current) => ({
                      ...current,
                      resume: "work",
                    }))
                  }
                >
                  III / PROJECTS
                </button>
                <button
                  type="button"
                  data-detail="experience"
                  aria-pressed={nav.details.resume === "experience"}
                  onClick={() =>
                    nav.setDetails((current) => ({
                      ...current,
                      resume: "experience",
                    }))
                  }
                >
                  IV / EXPERIENCE
                </button>
              </div>
              <div
                className="resume-detail"
                data-detail-content="education"
                hidden={nav.details.resume !== "education"}
              >
                <h3>Colegio IADIS</h3>
                <p className="content-note">
                  Junio de 2023 · San Francisco de Macorís, Duarte
                </p>
                <h3>Certificado de inglés B2+</h3>
                <p>Colegio IADIS Institute</p>
                <p className="content-note">
                  Febrero de 2021 · San Francisco de Macorís, Duarte
                </p>
              </div>
              <div
                className="resume-detail"
                data-detail-content="skills"
                hidden={nav.details.resume !== "skills"}
              >
                <h3>Habilidades profesionales</h3>
                <p>
                  Relaciones con clientes, atención al cliente, capacitación en
                  ventas, generación de confianza, soporte técnico y seguimiento
                  de ventas.
                </p>
                <p>
                  Comunicación eficaz, trabajo en equipo, resolución de
                  problemas y adaptación a nuevos retos.
                </p>
                <h3>Programación</h3>
                <p>
                  C# y Java, utilizados en los proyectos de este portafolio.
                </p>
                <h3>Idiomas</h3>
                <p>
                  Español e inglés: nivel nativo o bilingüe, según el CV.
                  Certificado de inglés B2+ del Colegio IADIS Institute.
                </p>
              </div>
              <p
                data-detail-content="work"
                hidden={nav.details.resume !== "work"}
              >
                Sacaito y los repositorios de Programación 3. Consulta SIDE
                PROJECTS para abrirlos.
              </p>
              <div
                className="resume-detail"
                data-detail-content="experience"
                hidden={nav.details.resume !== "experience"}
              >
                <h3>Agente de ventas · Voice Team</h3>
                <p className="content-note">Octubre de 2024 - junio de 2025</p>
                <p>San Francisco de Macorís, República Dominicana</p>
                <ul>
                  <li>
                    Generación de prospectos mediante una comunicación eficaz y
                    el desarrollo de relaciones con clientes potenciales.
                  </li>
                  <li>
                    Colaboración en estrategias de ventas para aumentar la
                    visibilidad de los productos y su penetración en el mercado.
                  </li>
                  <li>
                    Demostraciones de productos para presentar sus
                    características y beneficios.
                  </li>
                  <li>
                    Trabajo en equipo para alcanzar los objetivos mensuales de
                    ventas y mejorar el desempeño general.
                  </li>
                </ul>
              </div>
              <a
                className="panel-link"
                href="assets/documents/Leopoldo_Rodriguez_Fernandez_CV.pdf"
                download="Leopoldo_Rodriguez_Fernandez_CV.pdf"
              >
                DESCARGAR CV · PDF <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div
              id="panel-github"
              className="panel-content"
              data-content="github"
              hidden={nav.panel !== "github"}
            >
              <h2>
                CODE
                <br />
                BASE
              </h2>
              <p>Mi perfil de GitHub.</p>
              <a
                href="https://github.com/vert-2"
                className="panel-link"
                target="_blank"
                rel="noreferrer"
              >
                OPEN GITHUB <b></b>
              </a>
            </div>
            <div
              id="panel-social"
              className="panel-content"
              data-content="social"
              hidden={nav.panel !== "social"}
            >
              <h2>
                SOCIAL
                <br />
                ZONE
              </h2>
              <p>Mis redes sociales.</p>
              <div className="social-list">
                <a
                  className="panel-link"
                  href="https://www.linkedin.com/in/leopoldo-rodriguez-8724b1355/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LINKEDIN <span aria-hidden="true">↗</span>
                </a>
                <span>TIKTOK · PRÓXIMAMENTE</span>
                <span>INSTAGRAM · PRÓXIMAMENTE</span>
              </div>
            </div>
            <div
              id="panel-projects"
              className="panel-content"
              data-content="projects"
              hidden={nav.panel !== "projects"}
            >
              <h2>
                MY
                <br />
                PROJECTS
              </h2>
              <p>Proyectos disponibles en mi GitHub.</p>
              <div className="project-list" aria-label="Proyectos de GitHub">
                <a
                  className="project-link"
                  href="https://github.com/vert-2/Sacaito"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>01 // C#</span>
                  <b>
                    SACAITO <i>↗</i>
                  </b>
                  <small>Juego de cartas hecho en C#.</small>
                </a>
                <a
                  className="project-link"
                  href="https://github.com/vert-2/Programacion3-Clases-LeopoldoRodriguez"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>02 // JAVA</span>
                  <b>
                    PROGRAMACIÓN 3<br />
                    CLASES <i>↗</i>
                  </b>
                  <small>Clases de Programación 3.</small>
                </a>
                <a
                  className="project-link"
                  href="https://github.com/vert-2/Programacion3-Tareas-LeopoldoRodriguez"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>03 // JAVA</span>
                  <b>
                    PROGRAMACIÓN 3<br />
                    TAREAS <i>↗</i>
                  </b>
                  <small>Tareas de Programación 3.</small>
                </a>
              </div>
            </div>
          </aside>
        </section>

        {/* Indicaciones de navegación e identidad del pie. */}
        <footer className="hud-footer">
          <div className="control-hint">
            <i>↑ ↓</i>
            <span>SELECT / ENTER CONFIRM / ESC BACK</span>
          </div>
          <div className="identity">
            <b>LEO</b>
            <span>PORTFOLIO</span>
          </div>
        </footer>
      </main>

      {/* Reproductor persistente y biblioteca de audio. */}
      <section
        id="music-player"
        className={`music-player${nav.libraryOpen ? " is-open" : ""}`}
        aria-label="Reproductor de música"
      >
        <button
          id="music-toggle"
          ref={nav.musicToggle}
          onClick={() => nav.setLibraryOpen((open) => !open)}
          className="music-toggle"
          type="button"
          aria-expanded={nav.libraryOpen}
          aria-controls="music-library"
        >
          <span>♫</span>
          <small className="current-track">{music.label}</small>
          <i>+</i>
        </button>

        <div
          id="music-library"
          className="music-library"
          hidden={!nav.libraryOpen}
        >
          <div
            className="track-list"
            role="group"
            aria-label="Canciones disponibles"
          >
            <button
              className={`track${music.track === 0 ? " active" : ""}`}
              type="button"
              data-track="Jane Doe"
              data-source="assets/audio/Jane Doe.mp3"
              aria-pressed={music.track === 0}
              onClick={() => music.chooseTrack(0)}
            >
              <span>01</span> JANE DOE
            </button>
            <button
              className={`track${music.track === 1 ? " active" : ""}`}
              type="button"
              data-track="Mass Destruction -Reload-"
              data-source="assets/audio/Mass Destruction -Reload-.mp3"
              aria-pressed={music.track === 1}
              onClick={() => music.chooseTrack(1)}
            >
              <span>02</span> MASS DESTRUCTION -RELOAD-
            </button>
            <button
              className={`track${music.track === 2 ? " active" : ""}`}
              type="button"
              data-track="Color Your Night"
              data-source="assets/audio/Color Your Night.mp3"
              aria-pressed={music.track === 2}
              onClick={() => music.chooseTrack(2)}
            >
              <span>03</span> COLOR YOUR NIGHT
            </button>
            <button
              className={`track${music.track === 3 ? " active" : ""}`}
              type="button"
              data-track="Full Moon Full Life"
              data-source="assets/audio/Full Moon Full Life.mp3"
              aria-pressed={music.track === 3}
              onClick={() => music.chooseTrack(3)}
            >
              <span>04</span> FULL MOON FULL LIFE
            </button>
            <button
              className={`track${music.track === 4 ? " active" : ""}`}
              type="button"
              data-track="When The Moon's Reaching Out Stars -Reload-"
              data-source="assets/audio/When The Moon's Reaching Out Stars -Reload-.mp3"
              aria-pressed={music.track === 4}
              onClick={() => music.chooseTrack(4)}
            >
              <span>05</span> WHEN THE MOON'S REACHING OUT STARS
            </button>
          </div>
          <audio
            ref={music.audio}
            onLoadedMetadata={music.updateProgress}
            onTimeUpdate={music.updateProgress}
            onPlay={music.onPlay}
            onPause={music.onPause}
            onError={music.onError}
            onEnded={music.nextTrack}
            id="persona-player"
            preload="metadata"
          >
            <source src="assets/audio/Jane%20Doe.mp3" type="audio/mpeg" />
            Tu navegador no puede reproducir audio HTML5.
          </audio>
        </div>
        <div className="audio-console" aria-label="Controles de reproducción">
          <button
            id="previous-track"
            onClick={music.previousTrack}
            type="button"
            aria-label="Canción anterior"
          >
            ◀|
          </button>
          <button
            id="playback-toggle"
            onClick={music.togglePlayback}
            className={`playback-toggle${music.playing ? " is-playing" : ""}`}
            type="button"
            aria-label={music.playing ? "Pausar canción" : "Reproducir canción"}
          >
            {music.playing ? "Ⅱ" : "▶"}
          </button>
          <div className="progress-console">
            <div className="progress-labels">
              <span id="current-time">{formatTime(music.time)}</span>
              <span id="track-duration">{formatTime(music.duration)}</span>
            </div>
            <input
              id="playback-progress"
              onChange={(event) => music.seek(event.target.value)}
              style={{ "--track-progress": `${music.progress}%` }}
              type="range"
              min="0"
              max="100"
              value={music.progress}
              step="0.1"
              aria-label="Progreso de la canción"
            />
          </div>
          <button
            id="next-track"
            onClick={music.nextTrack}
            className="next-track"
            type="button"
            aria-label="Siguiente canción"
          >
            »
          </button>
        </div>
        <div className="volume-console">
          <button
            id="mute-toggle"
            onClick={music.toggleMute}
            type="button"
            aria-label={music.muted ? "Activar sonido" : "Silenciar"}
            aria-pressed={music.muted}
          >
            {music.muted ? "×" : "♪"}
          </button>
          <input
            id="music-volume"
            onChange={(event) => music.changeVolume(event.target.value)}
            type="range"
            min="0"
            max="100"
            value={music.muted ? 0 : Math.round(music.volume * 100)}
            aria-label="Volumen"
          />
          <span id="volume-value">{`${music.muted ? 0 : Math.round(music.volume * 100)}%`}</span>
        </div>

        <p className="music-note" role="status">
          {music.note}
        </p>
      </section>

      {/* Indicador de carga y lógica de la página. */}
      <div className={`loader${video.done ? " done" : ""}`}>
        <span>LOADING PERSONA</span>
        <i style={{ "--progress": `${video.progress}%` }}></i>
        <b>{String(video.progress).padStart(2, "0")}</b>
      </div>
    </>
  );
}
