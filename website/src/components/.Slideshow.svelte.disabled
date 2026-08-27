<script>
  import { onMount } from "svelte";

  export let slides = [];

  let currentIndex = 0;
  let showNotes = false;
  let showReferences = false;
  let isFullscreen = false;
  let container;
  const emptySlide = () => ({
    number: 0,
    slug: "",
    title: "",
    keyPoints: [],
    speaker: [],
    evidence: [],
  });
  let currentSlide = emptySlide();

  $: if (slides.length > 0 && currentIndex >= slides.length) {
    currentIndex = slides.length - 1;
  }

  $: currentSlide = slides[currentIndex] || emptySlide();

  function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
      currentIndex = index;
      updateUrl();
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function toggleNotes() {
    showNotes = !showNotes;
    localStorage.setItem("slideshow-notes", showNotes);
  }

  function toggleReferences() {
    showReferences = !showReferences;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function updateUrl() {
    if (typeof window !== "undefined") {
      const url = new URL(window.location);
      url.searchParams.set("slide", currentIndex + 1);
      window.history.replaceState({}, "", url);
    }
  }

  function handleKeydown(e) {
    const target = e.target;

    // Ignore shortcuts if focusing form inputs
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) {
      return;
    }

    // Prevent space/arrows from navigating slides if focusing buttons/links
    if (target && (target.tagName === "BUTTON" || target.tagName === "A")) {
      if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
        return;
      }
    }

    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      nextSlide();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    }
    if (e.key === "s" || e.key === "S") toggleNotes();
    if (e.key === "f" || e.key === "F") toggleFullscreen();
    if (e.key === "Escape") {
      showNotes = false;
      showReferences = false;
    }
  }

  onMount(() => {
    // Get initial slide from URL parameter
    const url = new URL(window.location);
    const slideParam = url.searchParams.get("slide");
    if (slideParam) {
      goToSlide(parseInt(slideParam) - 1);
    }

    // Restore notes preference
    const savedNotes = localStorage.getItem("slideshow-notes");
    if (savedNotes === "true") showNotes = true;

    const handleFullscreenChange = () => {
      isFullscreen = !!document.fullscreenElement;
    };

    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  });
</script>

<div class="slideshow-container" bind:this={container}>
  <div class="slideshow-main">
    <div class="slide-content">
      {#if currentSlide?.keyPoints}
        <div class="slide-title">
          <div class="slide-number">
            Slide {(currentSlide?.number ?? 0).toString().padStart(2, "0")}
          </div>
          <h1>{(currentSlide?.title ?? "").replace(/^Slide \d+ - /, "")}</h1>
        </div>

        <div class="slide-body">
          {#if currentSlide?.keyPoints && currentSlide.keyPoints.length > 0}
            <ul class="key-points">
              {#each currentSlide.keyPoints as point}
                <li>{point}</li>
              {/each}
            </ul>
          {/if}
        </div>
      {/if}
    </div>

    {#if showNotes && currentSlide?.speaker}
      <div class="slide-notes">
        <div class="notes-header">
          <h3>Speaker Notes</h3>
      <button on:click={toggleNotes} class="close-btn">✕</button>
        </div>
        <div class="notes-content">
          {#each currentSlide.speaker as note}
            <p>{note}</p>
          {/each}
        </div>
      </div>
    {/if}

    {#if showReferences && currentSlide?.evidence}
      <div class="slide-references">
        <div class="refs-header">
          <h3>Sources & Evidence</h3>
          <button on:click={toggleReferences} class="close-btn">✕</button>
        </div>
        <ul class="refs-list">
          {#each currentSlide.evidence as evidence}
            <li>{evidence}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  <div class="slideshow-controls">
    <div class="progress-bar">
      <div class="progress-fill" style={`width: ${((currentIndex + 1) / slides.length) * 100}%`}></div>
    </div>

    <div class="control-buttons">
      <button on:click={prevSlide} disabled={currentIndex === 0} class="nav-btn prev-btn">
        ← Previous
      </button>

      <div class="slide-counter">
        {currentIndex + 1} / {slides.length}
      </div>

      <button on:click={nextSlide} disabled={currentIndex === slides.length - 1} class="nav-btn next-btn">
        Next →
      </button>
    </div>

    <div class="control-options">
      <button on:click={toggleNotes} class={`option-btn ${showNotes ? "active" : ""}`}>
        {showNotes ? "Hide" : "Show"} Notes (S)
      </button>
      <button on:click={toggleReferences} class={`option-btn ${showReferences ? "active" : ""}`}>
        {showReferences ? "Hide" : "Show"} Sources
      </button>
      <button on:click={toggleFullscreen} class="option-btn" title="Toggle fullscreen (F)">
        {isFullscreen ? "Exit" : "Enter"} Fullscreen
      </button>
      <a href={`/talk/slides/${currentSlide.slug}/`} class="option-btn">
        Full Page →
      </a>
    </div>

    <div class="keyboard-hints">
      <p>
        <kbd>←</kbd> <kbd>→</kbd> Navigate •
        <kbd>S</kbd> Toggle notes •
        <kbd>F</kbd> Fullscreen •
        <kbd>Esc</kbd> Close overlays
      </p>
    </div>
  </div>
</div>

<style>
  .slideshow-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
  }

  .slideshow-main {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
  }

  .slide-content {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: auto;
  }

  .slide-title {
    margin-bottom: 2rem;
  }

  .slide-number {
    font-size: 0.875rem;
    text-transform: uppercase;
    color: var(--accent);
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .slide-title h1 {
    font-size: 2.5rem;
    line-height: 1.2;
    margin: 0;
  }

  .slide-body {
    font-size: 1.125rem;
    line-height: 1.6;
  }

  .key-points {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .key-points li {
    margin: 1rem 0;
    padding-left: 1.5rem;
    position: relative;
  }

  .key-points li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
  }

  .slide-notes {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 35%;
    max-height: 50%;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    overflow-y: auto;
    box-shadow: var(--shadow);
  }

  .slide-references {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 35%;
    max-height: 50%;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    overflow-y: auto;
    box-shadow: var(--shadow);
  }

  .notes-header,
  .refs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.75rem;
  }

  .notes-header h3,
  .refs-header h3 {
    margin: 0;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--muted);
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: var(--text);
  }

  .notes-content {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .notes-content p {
    margin: 0.75rem 0;
  }

  .refs-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .refs-list li {
    margin: 0.75rem 0;
    padding-left: 1rem;
    position: relative;
  }

  .refs-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--accent);
  }

  .slideshow-controls {
    background: var(--bg-elevated);
    border-top: 1px solid var(--border);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: var(--bg-soft);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.2s ease-out;
  }

  .control-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .nav-btn {
    padding: 0.75rem 1.5rem;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease-out;
  }

  .nav-btn:hover:not(:disabled) {
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .slide-counter {
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
  }

  .control-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .option-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease-out;
    text-decoration: none;
    display: inline-block;
  }

  .option-btn:hover {
    background: var(--accent-2);
    border-color: var(--accent-2);
  }

  .option-btn.active {
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }

  .keyboard-hints {
    font-size: 0.75rem;
    color: var(--muted);
    text-align: center;
  }

  .keyboard-hints p {
    margin: 0;
  }

  kbd {
    display: inline-block;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.25rem 0.5rem;
    font-family: monospace;
    font-size: 0.75rem;
    margin: 0 0.25rem;
  }

  @media (max-width: 860px) {
    .slide-content {
      padding: 1.5rem;
    }

    .slide-title h1 {
      font-size: 1.75rem;
    }

    .slide-body {
      font-size: 1rem;
    }

    .slide-notes,
    .slide-references {
      width: 100%;
      max-height: 40%;
    }

    .control-buttons {
      flex-wrap: wrap;
    }

    .option-btn {
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
    }
  }
</style>
