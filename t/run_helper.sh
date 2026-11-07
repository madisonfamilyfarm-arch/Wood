#!/bin/bash
pkill -f "[p]ython3 dji-phone" 2>/dev/null; sleep 0.3
cd /home/claude/t/srv && DJI_NOREMOTE=1 nohup python3 dji-phone-link.py --no-browser > /home/claude/t/helper.log 2>&1 &
sleep 1.2
