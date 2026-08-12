import pathlib

from presentation_artifact_tool import Blob, Presentation, PresentationFile

CURRENT_DIR = pathlib.Path(__file__).parent
GIRAFFE_IMAGE = CURRENT_DIR / "giraffe.png"


def quick_start_blob() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()
    slide.background.fill = "accent1"
    image = slide.images.add({"blob": Blob.load(GIRAFFE_IMAGE)})
    image.position = {"left": 600, "top": 150, "width": 256, "height": 384}
    return deck


if __name__ == "__main__":
    presentation = quick_start_blob()
    PresentationFile.export_pptx(presentation).save("quick_start_blob_presentation.pptx")
