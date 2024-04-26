import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from time import sleep
from gpiozero import Servo
import requests

servo = Servo(14)

GPIO.setwarnings(False)    # Ignore warning for now
GPIO.setmode(GPIO.BOARD)
reader = SimpleMFRC522()

placeCards = set()

SERVER_URL = "http://192.168.41.7:8080/api/parking-lots"

while True:
    try:
        id, text = reader.read()

        if (id in placeCards):
            print("Card already read")
            print(id)
            print(type(id))
            print(text)
            sleep(1)
            servo.min()
            sleep(2)
            requests.post(f"{SERVER_URL}/car-out", json={"parkingLotId": "122fe860-1ed8-4b43-a684-e150d59406e7",
                          "personId": "6776e108-4ab4-4e80-8307-a76a1c38f6b6"})
            servo.max()
            sleep(1)
            placeCards.remove(id)
        else:
            print("New card read")
            print(id)
            print(type(id))
            print(text)
            placeCards.add(id)
            requests.post(f"{SERVER_URL}/car-in", json={
                          "parkingLotId": "122fe860-1ed8-4b43-a684-e150d59406e7", "personId": "6776e108-4ab4-4e80-8307-a76a1c38f6b6"})
            sleep(1)
            servo.min()
            sleep(2)
            servo.max()
            sleep(1)
            placeCards.add(id)

    except:
        print("Error reading card")
        GPIO.cleanup()
