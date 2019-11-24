import cv2
import os
import numpy as np

mults = np.arange(2, 24, .002)

images = [f'images/{n:.3f}.png' for n in mults]
video = cv2.VideoWriter('movie.avi', cv2.VideoWriter_fourcc(*"MJPG"), 50, (1920, 1080))
for img in images:
    video.write(cv2.imread(img))
video.release()
