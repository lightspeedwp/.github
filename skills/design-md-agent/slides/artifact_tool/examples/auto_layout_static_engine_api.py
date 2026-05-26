from presentation_artifact_tool import (
    AutoLayout,
    AutoLayoutAlign,
    AutoLayoutDirection,
    AutoLayoutOptions,
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
)


def static_engine_api() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()

    labels = ["A", "B", "C"]
    shapes = []
    for idx, label in enumerate(labels):
        shape = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        shape.position = {"width": 40, "height": 40}
        shape.text = label
        shape.fill = f"accent{idx + 1}"
        shapes.append(shape)

    AutoLayout.apply(
        slide,
        shapes,
        AutoLayoutOptions(
            direction=AutoLayoutDirection.horizontal,
            frame="slide",
            align=AutoLayoutAlign.topCenter,
            horizontal_gap=32,
            vertical_padding=48,
        ),
    )

    return deck


if __name__ == "__main__":
    presentation = static_engine_api()
    PresentationFile.export_pptx(presentation).save("static_engine_api_presentation.pptx")
