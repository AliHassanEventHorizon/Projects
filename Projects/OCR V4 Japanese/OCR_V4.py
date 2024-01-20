import socketio
import threading
import keyboard
import os
from gradientai import Gradient
os.environ['GRADIENT_ACCESS_TOKEN'] = "xGiWYLUTu5gAtKpyp8JQA5mwxTzPk4Vj"
os.environ['GRADIENT_WORKSPACE_ID'] = "fbb16996-6d4e-40e4-b971-e68a83f80e60_workspace"
from pynput import keyboard
import mss
import logging
from PIL import Image
from manga_ocr import MangaOcr
import eventlet
import pyautogui
import socketio
sio = socketio.Server()
app = socketio.WSGIApp(sio)

x1 = 0
y1 = 0
x2 = 0
y2 = 0

logging.basicConfig(level=logging.WARNING)

@sio.event
def roi_control_x(sid, data):
    global x1, y1
    X1,Y1 = pyautogui.position()
    x1 = X1
    y1 = Y1
@sio.event
def roi_control_y(sid, data):
    global x2, y2
    X2,Y2 = pyautogui.position()
    x2 = X2
    y2 = Y2

def server():

    eventlet.wsgi.server(eventlet.listen(('localhost', 3000)), app)


def process_screenshots():

    with mss.mss() as sct:
     sct.shot(output="screenshot1.png")
    

    try:
        roi = (x1, y1, x2, y2)
        print(roi)
        print("First Screenshot Taken")
        mocr = MangaOcr()
        screenshot_pil = Image.open("screenshot1.png")
        cropped_screenshot = screenshot_pil.crop(roi)
        japanese = mocr(cropped_screenshot)
        os.remove("screenshot1.png")
        print("Text traslated")
        with Gradient() as gradient:
         base = gradient.get_base_model(base_model_slug="nous-hermes2")
         system_prompt = "Translate the Japanese text into English"
         prompt = japanese
         templated_query = f"<s>### Instruction:\n{system_prompt}\n\n###Input:\n{prompt}\n\n### Response:\n"
         response = base.complete(query=templated_query, max_generated_token_count=200)
         print(f"> {prompt}\n> {response.generated_output}\n\n")
         extracted_text = response.generated_output
        if extracted_text:
          data = {'message': extracted_text }
          sio.emit('transferControl', data)   
         
         
    except Exception as e:
        print(f"Error processing screenshot: {e}")

server_thread = threading.Thread(target=server)
server_thread.start()
key_to_process = keyboard.KeyCode.from_char('w')
with keyboard.Listener(on_press=lambda key: process_screenshots() if key == key_to_process else None) as listener:
    print(f"Press '{key_to_process}' to process screenshots. Press 'esc' to exit.")
    listener.join()





