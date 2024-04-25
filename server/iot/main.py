import RPi.GPIO as GPIO
import MFRC522
import signal
from gpiozero import Servo
from time import sleep

continue_reading = True

def end_read(signal,frame):
    global continue_reading
    print("Ctrl+C captured, ending read.")
    continue_reading = False
    GPIO.cleanup()

signal.signal(signal.SIGINT, end_read)

rfid = MFRC522.MFRC522()

servo = Servo(25)

def main():
    while continue_reading:
        (status,TagType) = rfid.MFRC522_Request(rfid.PICC_REQIDL)
        if status == rfid.MI_OK:
            print("Card detected")
        
        (status,uid) = rfid.MFRC522_Anticoll()

        if status == rfid.MI_OK:
            print ("Card read UID: %s,%s,%s,%s" % (uid[0], uid[1], uid[2], uid[3]))
            servo.min()
            sleep(0.5)
            servo.mid()
            sleep(0.5)
            servo.max()
            sleep(0.5)


main()