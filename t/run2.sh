#!/bin/bash
pkill -f "[p]ython3 dji-phone" 2>/dev/null; sleep 0.4
cp /home/claude/work/rc_real.html /home/claude/t/srv/woods-rc-sim.html; cp /home/claude/work/dji-phone-link.py /home/claude/t/srv/
cp /home/claude/work/rc_real.html /home/claude/t/srv2/woods-rc-sim.html; cp /home/claude/work/rc_real.html /home/claude/t/srv2/real.html; cp /home/claude/work/rc_real.html /home/claude/t/srv/real.html; cp /home/claude/work/dji-phone-link.py /home/claude/t/srv2/
cd /home/claude/t/srv && DJI_NOREMOTE=1 DJI_BEACON=8766 DJI_BEACON_TO=8766,8767 nohup python3 dji-phone-link.py --no-browser > /home/claude/t/helperA.log 2>&1 &
cd /home/claude/t/srv2 && DJI_NOREMOTE=1 DJI_PORT=8775 DJI_BEACON=8767 DJI_BEACON_TO=8766,8767 nohup python3 dji-phone-link.py --no-browser > /home/claude/t/helperB.log 2>&1 &
sleep 4
