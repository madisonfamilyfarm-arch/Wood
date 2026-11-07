#!/bin/bash
set -e
cd /home/claude/work
cp rc_pre_look.html rc.html
python3 look_patch.py >/dev/null
python3 apt_patch.py >/dev/null
python3 phys_patch.py >/dev/null
python3 v9_patch.py
python3 make_real.py
cp rc.html ../t/srv/woods-rc-sim.html; cp rc.html ../t/srv2/woods-rc-sim.html; cp rc_real.html ../t/srv/real.html; cp rc_real.html ../t/srv2/real.html
