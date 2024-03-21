import random
import urllib
import time
from urllib.request import urlopen

lines = []
four_letters = []
five_letters = []
six_letters = []
seven_letters = []

with open("words.txt") as f:
	line = f.readline()
	while line:
		line = line.replace("\n","")
		lines.append(line)
		line = f.readline()

for word in lines:
    if len(word) == 4:
        four_letters.append(word)
    elif len(word) == 5:
        five_letters.append(word)
    elif len(word) == 6:
        six_letters.append(word)
    elif len(word) == 7:
        seven_letters.append(word)

random.shuffle(four_letters)
random.shuffle(five_letters)
random.shuffle(six_letters)
random.shuffle(seven_letters)

print(len(four_letters))
print(len(five_letters))
print(len(six_letters))
print(len(seven_letters))

# with open('four_letter_words.txt', 'w') as f:
#     f.write("[")
#     count = 0
    
#     for word in four_letters:
#         if count >= 400:
#             print("pausing")
#             time.sleep(60)
#             count = 0
#         count += 1
#         try:
#             url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
#             with urllib.request.urlopen(url) as response:
#                 print(f'Word: {word} | Response: {response.status}')
#                 f.write("\"" + word + "\", ")
#         except urllib.error.URLError as e:
#             print(f'Word: {word} | Response: {e.reason}')
#             if e.reason == "Too Many Requests" or e.reason == "Internal Server Error":
#                 print("pausing")
#                 time.sleep(60)
#                 count = 0
#                 four_letters.append(word)
#             continue
#     f.write("\"000\"]")

with open('five_letter_words.txt', 'w') as f:
    f.write("[")
    count = 0
    
    for word in five_letters:
        if count >= 400:
            print("pausing")
            time.sleep(60)
            count = 0
        count += 1
        try:
            url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
            with urllib.request.urlopen(url) as response:
                print(f'Word: {word} | Response: {response.status}')
                f.write("\"" + word + "\", ")
        except urllib.error.URLError as e:
            print(f'Word: {word} | Response: {e.reason}')
            if e.reason == "Too Many Requests" or e.reason == "Internal Server Error":
                print("pausing")
                time.sleep(60)
                count = 0
                five_letters.append(word)
            continue
    f.write("\"000\"]")

with open('six_letter_words.txt', 'w') as f:
    f.write("[")
    count = 0
    
    for word in six_letters:
        if count >= 400:
            print("pausing")
            time.sleep(60)
            count = 0
        count += 1
        try:
            url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
            with urllib.request.urlopen(url) as response:
                print(f'Word: {word} | Response: {response.status}')
                f.write("\"" + word + "\", ")
        except urllib.error.URLError as e:
            print(f'Word: {word} | Response: {e.reason}')
            if e.reason == "Too Many Requests" or e.reason == "Internal Server Error":
                print("pausing")
                time.sleep(60)
                count = 0
                six_letters.append(word)
            continue
    f.write("\"000\"]")

with open('seven_letter_words.txt', 'w') as f:
    f.write("[")
    count = 0
    
    for word in seven_letters:
        if count >= 400:
            print("pausing")
            time.sleep(60)
            count = 0
        count += 1
        try:
            url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
            with urllib.request.urlopen(url) as response:
                print(f'Word: {word} | Response: {response.status}')
                f.write("\"" + word + "\", ")
        except urllib.error.URLError as e:
            print(f'Word: {word} | Response: {e.reason}')
            if e.reason == "Too Many Requests" or e.reason == "Internal Server Error":
                print("pausing")
                time.sleep(60)
                count = 0
                seven_letters.append(word)
            continue
    f.write("\"000\"]")
