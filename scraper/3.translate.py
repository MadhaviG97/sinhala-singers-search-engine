import time
from selenium import webdriver
import json

f = open('data/english.json')
english = json.load(f)
f.close()

translated = {}
unique = set()

LANGUAGE = 'si'
browser = webdriver.Chrome("/usr/bin/chromedriver")

for key in english:
    source = english[key]['name']

    if source in unique:
        continue

    unique.add(source)

    translated[key] = english[key]

    if ord(source[0]) < 200:
        browser.get("https://translate.google.co.in/?sl=en&tl="+LANGUAGE+"&text="+source+"&op=translate")
        time.sleep(10)
        target = browser.find_element_by_xpath('/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[2]/div[5]/div/div[1]').text
        translated[key]["name"] = target
    
    source = english[key]['summary']
    if ord(source[0]) < 200:
        browser.get("https://translate.google.co.in/?sl=en&tl="+LANGUAGE+"&text="+source+"&op=translate")
        time.sleep(10)
        target = browser.find_element_by_xpath('/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[2]/div[5]/div/div[1]').text
        translated[key]["summary"] = target

with open('data/sinhala.json', 'w') as f:
    f.write("%s,\n" % translated)
