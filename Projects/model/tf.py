import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from PIL import Image
import numpy as np
b=1
a = 1
imges = []

while a < 8:
    path = f"./X_train/{a}.png"
    img = Image.open(path)
    img_resized = img.resize((28, 28))
    img_resized_gray = img_resized.convert('L')
    img_array = np.array(img_resized_gray)
    img_array = img_array / 255.0
    imges.append(img_array)
    a += 1
imges = np.array(imges)
test_images=[]
while b<3:
    path = f"./X_train/x{b}.png"
    img = Image.open(path)
    img_resized = img.resize((28, 28))
    img_resized_gray = img_resized.convert('L')
    img_array = np.array(img_resized_gray)
    img_array = img_array / 255.0
    test_images.append(img_array)
    b+=1 

test_array = np.array(test_images)
model = Sequential()
model.add(Flatten(input_shape=(28, 28)))
model.add(Dense(128, activation='relu'))
model.add(Dense(5, activation='softmax'))

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

Y_train = np.array([[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1],[1, 0, 0, 0, 0],[0, 1, 0, 0, 0]])
model.fit(imges, Y_train, epochs=300)
pre = model.predict(imges)
print(pre)
predicted_classes = np.argmax(pre, axis=1) + 1
print("Predicted classes:", predicted_classes)
