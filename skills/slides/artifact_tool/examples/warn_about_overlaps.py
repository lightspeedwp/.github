from pathlib import Path

from presentation_artifact_tool import Blob, OverlapInfo, PresentationFile, warn_about_overlaps


def get_presentation_overlap_info(
    file_path: str | Path, emit: bool = True
) -> dict[int, list[OverlapInfo]]:
    presentation = PresentationFile.import_pptx(Blob.load(file_path))

    overlap_info: dict[int, list[OverlapInfo]] = {}
    for _slide_num, slide in enumerate(presentation.slides.items, start=1):
        overlap_info[_slide_num] = warn_about_overlaps(slide, slide_number=_slide_num, emit=emit)
    return overlap_info
