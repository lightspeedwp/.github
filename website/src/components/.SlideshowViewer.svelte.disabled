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
    description: "",
    keyPoints: [],
    evidence: [],
    speaker: [],
    accessibility: [],
    sourceFile: "",
    sourceHref: "",
    pageHref: "",
  });

  $: if (slides.length > 0 && currentIndex >= slides.length) {
    currentIndex = slides.length - 1;
  }

  const currentSlide = () => slides[currentIndex] ?? emptySlide();
  const isFirst = () => currentIndex === 0;
  const isLast = () => currentIndex === slides.length - 1;

  const nextSlide = () => {
    if (!isLast()) currentIndex++;
  };

  const prevSlide = () => {
    if (!isFirst()) currentIndex--;
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < slides.length) {
      currentIndex = index;
    }
  };

  const toggleNotes = () => {
    showNotes = !showNotes;
  };

  const toggleReferences = () => {
    showReferences = !showReferences;
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await container?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  onMount(() => {
    const handleKeydown = (e) => {
      const target = e.target;

      // Ignore shortcuts if focusing form inputs
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Prevent space/arrows from navigating slides if focusing buttons/links
      if (target && (target.tagName === "BUTTON" || target.tagName === "A")) {
        if (
          e.key === " " ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Enter"
        ) {
          return;
        }
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "n":
          toggleNotes();
          break;
        case "r":
          toggleReferences();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          showNotes = false;
          showReferences = false;
          break;
      }
    };

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

<div bind:this={container} class="slideshow-container">
  {#if slides.length > 0}
    <div class="slideshow-main">
      <div class="slide-display">
        <div class="slide-header">
        <div class="slide-number">
            {currentSlide().number.toString().padStart(2, "0")} / {slides.length
              .toString()
              .padStart(2, "0")}
          </div>
          <div class="slide-title">{currentSlide().title}</div>
        </div>

        <div class="slide-content">
          <p>{currentSlide().description}</p>

          {#if currentSlide().keyPoints.length > 0}
            <div class="key-points">
              <h3>Key points</h3>
              <ul>
                {#each currentSlide().keyPoints as point}
                  <li>{point}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>

      <div class="slide-overlays">
        {#if showNotes && currentSlide().speaker.length > 0}
          <div class="overlay notes-overlay">
            <div class="overlay-header">
              <h3>Speaker notes</h3>
              <button on:click={toggleNotes} aria-label="Close speaker notes">
                ✕
              </button>
            </div>
            <div class="overlay-content">
              <ul>
                {#each currentSlide().speaker as note}
                  <li>{note}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}

        {#if showReferences && currentSlide().evidence.length > 0}
          <div class="overlay references-overlay">
            <div class="overlay-header">
              <h3>References</h3>
              <button on:click={toggleReferences} aria-label="Close references">
                ✕
              </button>
            </div>
            <div class="overlay-content">
              <ul>
                {#each currentSlide().evidence as ref}
                  <li>{ref}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>

      <div class="slide-controls">
        <div class="control-group">
          <button
            on:click={prevSlide}
            disabled={isFirst()}
            aria-label="Previous slide"
            class="nav-button"
          >
            ← Prev
          </button>

          <div class="slide-indicator">
            {#each slides as slide, i}
              <button
                on:click={() => goToSlide(i)}
                class={i === currentIndex ? "active" : ""}
                aria-label="Go to slide {slide.number}"
                aria-current={i === currentIndex ? "step" : undefined}
              >
                {slide.number.toString().padStart(2, "0")}
              </button>
            {/each}
          </div>

          <button on:click={nextSlide} disabled={isLast()} aria-label="Next slide" class="nav-button">
            Next →
          </button>
        </div>

        <div class="control-group action-buttons">
          <button
            on:click={toggleNotes}
            class={showNotes ? "active" : ""}
            title="Toggle speaker notes (N)"
            aria-label="Toggle speaker notes"
            disabled={currentSlide().speaker.length === 0}
          >
            Notes
          </button>
          <button
            on:click={toggleReferences}
            class={showReferences ? "active" : ""}
            title="Toggle references (R)"
            aria-label="Toggle references"
            disabled={currentSlide().evidence.length === 0}
          >
            References
          </button>
          <button
            on:click={toggleFullscreen}
            title="Toggle fullscreen (F)"
            aria-label="Toggle fullscreen"
          >
            Fullscreen
          </button>
          <a href={currentSlide().pageHref} class="view-page-button">
            View page →
          </a>
        </div>
      </div>

      <div class="keyboard-hints">
        <p>
          <kbd>→</kbd> next •
          <kbd>←</kbd> prev •
          <kbd>N</kbd> notes •
          <kbd>R</kbd> refs •
          <kbd>F</kbd> fullscreen
        </p>
      </div>
    </div>
  {:else}
    <p>No slides available</p>
  {/if}
</div>

<style>
  .slideshow-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
  }

  .slideshow-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .slide-display {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 3rem 2rem;
    overflow-y: auto;
  }

  .slide-header {
    margin-bottom: 2rem;
  }

  .slide-number {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .slide-title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 1rem;
  }

  .slide-content {
    flex: 1;
  }

  .slide-content > p {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .key-points {
    margin-top: 2rem;
  }

  .key-points h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  .key-points ul {
    list-style: none;
    padding: 0;
  }

  .key-points li {
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
    position: relative;
  }

  .key-points li:before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--text-secondary);
  }

  .slide-overlays {
    position: relative;
    height: 0;
  }

  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 400px;
    height: 100%;
    background: var(--bg-tertiary);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 100;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .overlay-header h3 {
    margin: 0;
    font-size: 1rem;
  }

  .overlay-header button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: var(--text-secondary);
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .overlay-header button:hover {
    color: var(--text-primary);
  }

  .overlay-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .overlay-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .overlay-content li {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 4px;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .slide-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
  }

  .control-group {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .nav-button {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .nav-button:hover:not(:disabled) {
    background: var(--accent);
    color: white;
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .slide-indicator {
    display: flex;
    gap: 0.25rem;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
  }

  .slide-indicator button {
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .slide-indicator button:hover {
    background: var(--bg-quaternary);
    color: var(--text-primary);
  }

  .slide-indicator button.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .action-buttons {
    justify-content: center;
  }

  .action-buttons button,
  .view-page-button {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .action-buttons button:hover:not(:disabled),
  .view-page-button:hover {
    background: var(--accent);
    color: white;
  }

  .action-buttons button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-buttons button.active {
    background: var(--accent);
    color: white;
  }

  .keyboard-hints {
    text-align: center;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
  }

  .keyboard-hints p {
    margin: 0;
  }

  .keyboard-hints kbd {
    background: var(--bg-tertiary);
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.75rem;
    border: 1px solid var(--border);
  }

  @media (max-width: 768px) {
    .overlay {
      max-width: 100%;
    }

    .slide-title {
      font-size: 1.5rem;
    }

    .slide-display {
      padding: 1.5rem 1rem;
    }

    .slide-indicator {
      max-height: 6rem;
      overflow-y: auto;
    }

    .keyboard-hints {
      display: none;
    }
  }
</style>
