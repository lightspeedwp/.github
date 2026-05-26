from presentation_artifact_tool import (
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
    ShapePositionConfig,
)


def quick_start() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()

    # Background
    slide.background.fill = "accent4"

    # Duplicate
    slide2 = slide.duplicate()

    # Add shapes
    title = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=400))
    )
    title.text = "Slide 1:Vision & Strategy"

    title2 = slide2.shapes.add(
        PresetShapeGeometryConfig(geometry="rect", position=ShapePositionConfig(width=400))
    )
    title2.text = "Slide 2: Financial Overview"

    return deck


if __name__ == "__main__":
    presentation = quick_start()
    PresentationFile.export_pptx(presentation).save("slide_quick_start_presentation.pptx")
