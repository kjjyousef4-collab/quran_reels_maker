# 🕌 صانع ريلز القرآن الكريم | Quran Reels Maker

> صدقة جارية — أنشئ مقاطع فيديو قرآنية مذهلة للمشاركة على وسائل التواصل

---
title: Quran Reels Maker
emoji: 🕌
sdk: static
---

## ✨ المميزات

- 🎙️ **+23 قارئ** من أشهر قراء العالم الإسلامي
- 📖 **114 سورة** مع التحقق التلقائي من أرقام الآيات
- 🎨 **صور خلفية جميلة** من Pixabay مع تأثيرات Ken Burns
- 🎬 **تصدير MP4** متوافق مع واتساب وفيسبوك وإنستجرام
- 📱 **يعمل على الجوال** مع وضع سريع للأجهزة الضعيفة
- 🔒 **بدون سيرفر** — كل المعالجة تتم على جهازك

## 🚀 التشغيل المحلي

```bash
# أي خادم ملفات ثابت يعمل:
npx serve .
# أو
python -m http.server 8000
```

ثم افتح `http://localhost:8000` في المتصفح.

## 🔑 إعداد مفتاح Pixabay API

1. سجل مجاناً في [pixabay.com/api/docs](https://pixabay.com/api/docs/)
2. انسخ مفتاح الـ API
3. في ملف `app.js`، استبدل قيمة `USER_PIXABAY_KEY`

> إذا لم يتوفر مفتاح، سيعمل الموقع بخلفيات تدريجية متحركة تلقائياً.

## 📤 النشر على GitHub Pages

1. أنشئ مستودع جديد على GitHub
2. ارفع الملفات: `index.html`, `styles.css`, `app.js`, `README.md`
3. اذهب لـ **Settings → Pages**
4. اختر **Source: Deploy from a branch**
5. اختر **Branch: main**, **Folder: / (root)**
6. اضغط Save — سيكون الموقع جاهز خلال دقائق!

## 🤗 النشر على Hugging Face Spaces (Static)

1. أنشئ Space جديد في [huggingface.co/spaces](https://huggingface.co/spaces)
2. اختر **SDK: Static**
3. ارفع جميع الملفات
4. ملف README.md يحتوي بالفعل على الإعدادات المطلوبة (title, emoji, sdk)

## 🐍 Streamlit Wrapper (اختياري)

إذا أردت تقديم الموقع عبر Streamlit:

```python
# streamlit_app.py
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="صانع ريلز القرآن", page_icon="🕌", layout="wide")

with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# Inline CSS and JS
with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()
with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

full_html = html_content.replace(
    '<link rel="stylesheet" href="styles.css">',
    f'<style>{css}</style>'
).replace(
    '<script src="app.js"></script>',
    f'<script>{js}</script>'
)

components.html(full_html, height=900, scrolling=True)
```

```bash
pip install streamlit
streamlit run streamlit_app.py
```

## 🧪 المتطلبات التقنية

| الميزة | المتصفح المطلوب |
|--------|----------------|
| تصدير MP4 (WebCodecs) | Chrome 94+ / Edge 94+ |
| تصدير MP4 (Fallback) | أي متصفح يدعم MediaRecorder + FFmpeg.wasm |
| أفضل تجربة | Chrome أو Edge على سطح المكتب |

## 📋 البنية

```
quran/
├── index.html      # الهيكل الرئيسي (RTL Arabic)
├── styles.css      # التصميم (Glass + Neon Gold)
├── app.js          # المنطق الكامل (client-side)
└── README.md       # هذا الملف
```

## 🤲 صدقة جارية

> « الدال على الخير كفاعله »

شارك هذا المشروع مع أصدقائك وعائلتك ليستفيد منه أكبر عدد من المسلمين.
