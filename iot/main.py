import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from time import sleep
from gpiozero import Servo

servo = Servo(14)

GPIO.setwarnings(False)    # Ignore warning for now
GPIO.setmode(GPIO.BOARD)
reader = SimpleMFRC522()
while True:
    try:
        id, text = reader.read()
        print(id)
        print(type(id))
        print(text)
        sleep(1)
        servo.min()
        sleep(1)
        servo.max()
        sleep(1)

    except:
        print("Error reading card")
        GPIO.cleanup()
