#!/bin/bash
# ship.sh <version> "<message>" : copy rc_real.html everywhere + push to GitHub Pages
set -e; V=$1; MSG=$2; O=/mnt/user-data/outputs; W=/home/claude/work
LAST=$(ls -d $O/v[0-9]* | sort -V | tail -1); [ -d $O/$V ] || cp -r $LAST $O/$V
for d in $O/$V $O/Woods-RC-Sim-Multiplayer; do cp $W/rc_real.html $d/woods-rc-sim.html; cp $W/rc_real.html "$d/Latest version.html"; done
for d in $O/Woods-RC-Sim-Multiplayer /home/claude/wood; do rm -rf $d/words; mkdir -p $d/words; cp /home/claude/wn/out/ai-words-*.js /home/claude/wn/rh/ai-rhymes-*.js $d/words/; done
cp $W/rc_real.html "$O/Latest version.html"; cp $W/rc_real.html $O/woods-rc-sim.html
cd $O && rm -f Woods-RC-Sim-Multiplayer.zip && zip -qr Woods-RC-Sim-Multiplayer.zip Woods-RC-Sim-Multiplayer
cd /home/claude/wood && cp $W/rc_real.html index.html && git add -A && git commit -qm "$V: $MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RPRo1QphAagBhZknpbkN3y" && git push -q 2>&1 | grep -iv "moved\|location\|Wood.git" || true; git log --oneline | head -1
