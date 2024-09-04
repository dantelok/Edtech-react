import json
import os
import base64
import argparse
import gradio as gr

import vertexai
from src.models import google_vision_ocr, google_multimodal_gemini, get_completion


def main():
    project_id = "edtech-428610"
    vertexai.init(project=project_id, location="us-central1")

    # image_path = "data/Demo_level5.png"
    # response = google_multimodal_gemini("data/Demo_level5.png")

    iface = gr.Interface(
        fn=google_multimodal_gemini,
        inputs=gr.Image(type="filepath", label="Upload an Image"),
        outputs=gr.Markdown(label="Output JSON",
                            height=2000,
                            latex_delimiters=[
                                {"left": '$$', "right": '$$', "display": True},
                                {"left": '$', "right": '$', "display": True},
                                {"left": '\\', "right": '\\', "display": True},
                                {"left": '\\[', "right": '\\]', "display": True}
                            ]),
        title="AutoGrader v1.0",
        description="This app accepts an image and a prompt, processes them using a language model function, \
        and returns the output as JSON."
    )

    iface.launch(share=True)


if __name__ == "__main__":
    main()
