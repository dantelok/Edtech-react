## OCR for HA appointment slip

* Google Vision handles the OCR
* OpenAI ChatGPT(GPT-3.5) handles the context understanding and summarization
* This program will generate the appointment data in JSON format with keys "hospital name", "department", "date", and "time"


## How to Run?
* python 3.11+
* Run `pip install requirements.txt`
* Run `python main.py {image_file_path}`
* Remarks: NO crop of the image required!