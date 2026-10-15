# يولّد voice/index.js من voice_lines.json للمقاطع المسجّلة فعلًا فقط (voice/ar و voice/en)
import json, os
D = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(D, 'voice_lines.json')))
out = {'ar': {}, 'en': {}}
for l in L:
    if os.path.exists(os.path.join(D, l['lang'], l['id'] + '.mp3')):
        out[l['lang']][l['id']] = l['plain']
with open(os.path.join(D, 'index.js'), 'w') as f:
    f.write('/* مولّد آليًا بـ voice/make_index.py — لا تعدّله يدويًا */\nwindow.VOICE = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(out['ar']), len(out['en']))
