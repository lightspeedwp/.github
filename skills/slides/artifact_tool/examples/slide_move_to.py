from presentation_artifact_tool import Presentation, PresentationFile


def move_to() -> Presentation:
    deck = Presentation.create()
    first = deck.slides.add()  # noqa: F841
    second = deck.slides.add()

    # Move the second slide to the first position
    second.move_to(0)

    return deck


if __name__ == "__main__":
    presentation = move_to()
    PresentationFile.export_pptx(presentation).save("move_to_presentation.pptx")
