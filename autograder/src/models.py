import json
import os
import base64
import argparse

from openai import OpenAI
from google.cloud import vision

import vertexai
from vertexai.generative_models import GenerationConfig, GenerativeModel, Part

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'tikcare-d0cb9-dc5a5f9b20e3.json'
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "edtech-428610-e4afe89e1d27.json"
os.environ['OPENAI_API_KEY'] = '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'


def google_vision_ocr(image_path):
    # Create argument parse from command
    # parser = argparse.ArgumentParser(description='Process image file for OCR.')
    # parser.add_argument('image_path',
    #                     type=str,
    #                     help='The path to the image file')

    # args = parser.parse_args()
    # image_path = args.image_path

    # GCP Vision
    """Detect text in an image file."""
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # for non-dense text
    # resposne = client.text_detection(image=image)

    # for dense text
    response = client.document_text_detection(image=image)
    texts = response.text_annotations
    ocr_text = []

    for text in texts:
        ocr_text.append(f"\r\n{text.description}")

    if response.error.message:
        raise Exception(
            f"{response.error.message}"
        )

    return ocr_text[0]


# OpenAI
def get_completion(prompt, model="gpt-4o"):
    client = OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "Provide output in valid JSON"},
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content


def google_multimodal_gemini(image):
    prompt_template = f"""
        You are receiving a OCR output from a math exam paper.
        Your task is to identify the following:

        1. What is the full questions of the math exam paper? 
            Use plain text to express words and Latex to express mathematical formula.
            Be aware of the Latex expression must be start with $$ and end with $$.
        2. What is the student's answer in details?
        3. Is the answer correct? Please do the question once yourself and consider the student's answer and yours.
        If the answer is not correct, provide the details why it is not correct.

        Provide answers in Text format with the following keys and do not say anything else:
        Question 1:\n
            1. Question: (Output)\n
            2. Answer: (Output)\n
            3. Is it correct? (Yes / No, why?) \n
        Question 2:\n
            ...
            
        Notice that you may have more than 1 Text output if there are multiple questions and answers.
        """
    #
    # Review: ```{text}```

    # Encoded images
    encoded_image = base64.b64encode(image).decode("utf-8")
    image_content = Part.from_data(
        data=base64.b64decode(encoded_image), mime_type="image/png"
    )

    # Gemini Model
    gemini_model = GenerativeModel(model_name="gemini-1.5-flash-preview-0514")
    # Generation Config
    generation_config = GenerationConfig(
        max_output_tokens=2048,
        temperature=0.4,
        top_p=1,
        top_k=32
    )

    # Response
    model_response = gemini_model.generate_content(
        contents=[image_content, prompt_template],
        generation_config=generation_config
    )

    return model_response.candidates[0].content.parts[0].text
