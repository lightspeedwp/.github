from presentation_artifact_tool import (
    AutoLayoutAlign,
    AutoLayoutDirection,
    AutoLayoutOptions,
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
    ShapePositionConfig,
)


def horizontal_layout() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()

    panel = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="rect",
            position=ShapePositionConfig(left=80, top=120, width=640, height=200),
        )
    )
    panel.fill = "accent2"

    labels = ["MRR", "Active Users", "NPS Score"]
    metrics = []
    for label in labels:
        metric = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        metric.text = label
        metric.position = {"width": 160, "height": 80}
        metrics.append(metric)

    slide.auto_layout(
        metrics,
        AutoLayoutOptions(
            direction=AutoLayoutDirection.horizontal,
            frame=panel,
            align=AutoLayoutAlign.center,
            horizontal_gap=24,
            horizontal_padding=32,
            vertical_padding=24,
        ),
    )

    return deck


if __name__ == "__main__":
    presentation = horizontal_layout()
    PresentationFile.export_pptx(presentation).save("horizontal_layout_presentation.pptx")
