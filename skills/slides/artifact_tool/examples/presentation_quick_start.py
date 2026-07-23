from presentation_artifact_tool import (  # noqa: E402
    Presentation,
    PresentationFile,
)


def quick_start() -> Presentation:
    deck = Presentation.create()

    cover = deck.slides.add()
    agenda = deck.slides.add()

    cover.background.fill = "accent1"
    agenda.background.fill = "accent2"

    return deck


if __name__ == "__main__":
    presentation = quick_start()
    PresentationFile.export_pptx(presentation).save("quick_start_presentation.pptx")
