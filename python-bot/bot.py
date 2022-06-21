#!/usr/bin/env python3
from pyrogram import Client
from pyrogram import filters
import requests
import json


ACCOUNT = "84389758721"
PHONE_NR = '+84389758721'

API_ID = 14031826
API_HASH = 'e47d7d1fabe2dee326f9775b9cc38abb'

app = Client(ACCOUNT, phone_number=PHONE_NR, api_id=API_ID, api_hash=API_HASH)

M3 = -1001523057624  # A Group BOT Global - M.3
M4 = -1001759682447  # A Group BOT Global - M.4
M5 = -1001602050936  # A Group BOT Global - M.5
M6 = -1001530425363  # A Group BOT Global - M.6

####
M1 = -1001691424791  # A Group BOT Global - M.1
M2 = -1001707630450  # A Group BOT Global - M.2

M6_2 = -1001552089170  # A Group BOT Global - M.6.2
M6_3 = -1001724267945  # A Group BOT Global - M.6.3
M6_4 = -1001763860744  # A Group BOT Global - M.6.4
M6_5 = -1001199073863  # A Group BOT Global - M.6.5

M6_v2 = -1001640215187  # AI M6v2


@app.on_message(filters.text & filters.chat(M3))
@app.on_message(filters.text & filters.chat(M4))
@app.on_message(filters.text & filters.chat(M5))
@app.on_message(filters.text & filters.chat(M6))
####
@app.on_message(filters.text & filters.chat(M1))
@app.on_message(filters.text & filters.chat(M2))
@app.on_message(filters.text & filters.chat(M6_2))
@app.on_message(filters.text & filters.chat(M6_3))
@app.on_message(filters.text & filters.chat(M6_4))
@app.on_message(filters.text & filters.chat(M6_5))
@app.on_message(filters.text & filters.chat(M6_v2))

def copy_to_channel(client, message):
    try:
        url = "http://localhost:3001/api/message/bot-signal"
        bot_id = 0
        if message.chat.id == M1:
            bot_id = 1
        if message.chat.id == M2:
            bot_id = 2
        if message.chat.id == M3:
            bot_id = 3
        if message.chat.id == M4:
            bot_id = 4
        if message.chat.id == M5:
            bot_id = 5
        if message.chat.id == M6:
            bot_id = 6

        msg = message.text

        payload = json.dumps({
            "bot_id": bot_id,
            "message": msg
        })

        headers = {
            'Content-Type': 'application/json'
        }

        if(msg.find('Mọi người! Hãy đánh') != -1):
            requests.request("POST", url, headers=headers, data=payload)
        if(msg.find('Lượt vừa xong') != -1):
            requests.request("POST", url, headers=headers, data=payload)

    except Exception as e:
        print(e)
        



app.run()

# nohup python3 dmbot6_signal.py &
