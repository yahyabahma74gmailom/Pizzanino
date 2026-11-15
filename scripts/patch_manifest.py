p = 'android/app/src/main/AndroidManifest.xml'
s = open(p, encoding='utf-8').read()
perms = '<uses-permission android:name="android.permission.RECORD_AUDIO"/><uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>'
f = '<intent-filter><action android:name="android.intent.action.VIEW"/><category android:name="android.intent.category.DEFAULT"/><category android:name="android.intent.category.BROWSABLE"/><data android:scheme="pizzasocia" android:host="auth"/></intent-filter>'
s = s.replace('<application', perms + '<application', 1).replace('</activity>', f + '</activity>', 1)
open(p, 'w', encoding='utf-8').write(s)
