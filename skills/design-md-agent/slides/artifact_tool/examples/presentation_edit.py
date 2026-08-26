from pathlib import Path

from presentation_artifact_tool import Blob, Presentation, PresentationFile

CURRENT_DIR = Path(__file__).parent
PRESENTATION_FILE = CURRENT_DIR / "starter_presentation.pptx"


def edit_presentation() -> Presentation:
    presentation = PresentationFile.import_pptx(Blob.load(PRESENTATION_FILE))

    slide1 = presentation.slides.items[0]
    slide1.background.fill = "accent1"

    title = next(
        shape for shape in slide1.shapes.items if shape.text.to_string() == "Simple Presentation"
    )
    title.text = "Better Presentation"
    title.text.font_size = 48

    return presentation


if __name__ == "__main__":
    presentation = edit_presentation()
    PresentationFile.export_pptx(presentation).save("edit_presentation.pptx")
