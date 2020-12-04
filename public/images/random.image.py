import os
import random

path = "/home/amish/Documents/French/Images/Verbes/Images"
images = os.listdir(path)
os.system("eog " + path + "/"+ images[random.randint(0, len(images))])
