<<<<<<< HEAD
# iframe-modal-app
=======
# 🌐 React iframe Modal - useSyncExternalStore

একটি আধুনিক React প্রজেক্ট যা **useSyncExternalStore Hook** ব্যবহার করে external store (iframe) কে React এর সাথে sync করে। এটি **HTML5 postMessage API** এর মাধ্যমে parent window এবং iframe এর মধ্যে যোগাযোগ করে।

---


## 🎯 প্রজেক্ট সম্পর্কে

এই প্রজেক্টে আমরা শিখেছি:

### ✅ **useSyncExternalStore Hook**
- External data store এর সাথে React component কে sync করা
- Snapshot caching এর মাধ্যমে infinite loop এড়ানো
- Real-time state updates

### ✅ **HTML5 postMessage API**
- iframe এবং parent window এর মধ্যে secure communication
- Cross-origin messaging

### ✅ **External Store Management**
- React এর বাইরে data management
- Custom subscription system
- Listener pattern implementation

---

## 🚀 Quick Start

### 📋 Requirements
- Node.js (v14+ এর উপরে)
- npm বা yarn

### 📥 Installation

```bash
# Repository clone করো
git clone https://github.com/YOUR_USERNAME/iframe-modal-app.git

# প্রজেক্ট ডিরেক্টরিতে যাও
cd iframe-modal-app

# Dependencies install করো
npm install
```

### 🏃 Development Server চালাও

```bash
npm run dev
```

এটা খুলবে: `http://localhost:5173`

### 🔨 Production Build করো

```bash
npm run build
```

Build files তৈরি হবে `dist/` ফোল্ডারে।

### 👀 Build Preview করো

```bash
npm run preview
```

---

## 📁 প্রজেক্ট Structure

```
iframe-modal-app/
│
├── src/
│   ├── components/
│   │   ├── Store.js                 # External Store + Snapshot Caching
│   │   ├── IframeModal.jsx          # iframe HTML Content
│   │   ├── MainApp.jsx              # Main React Component
│   │   └── MainApp.module.css       # Component Styling
│   │
│   ├── App.jsx                      # Root Component
│   ├── main.jsx                     # React DOM Entry Point
│   └── index.css                    # Global Styles
│
├── public/                          # Static Files
├── index.html                       # HTML Template
├── package.json                     # Dependencies & Scripts
├── vite.config.js                   # Vite Configuration
├── .gitignore                       # Git Ignore Rules
└── README.md                        # এই ফাইল
```

---

## 🔑 Key Components

### 1️⃣ **Store.js** - External Store

```javascript
// External data store (React এর বাইরে)
const iframeModalStore = {
  _state: { isOpen, title, message, userInput },
  _listeners: [],
  
  openModal(title, message) { ... }
  closeModal() { ... }
  setInput(value) { ... }
  subscribe(callback) { ... }
}

// Snapshot Caching (Infinite Loop এড়ানোর জন্য)
let cachedSnapshot = null;

function getSnapshot() {
  const current = { isOpen, title, message, userInput };
  
  if (!cachedSnapshot || 
      JSON.stringify(cachedSnapshot) !== JSON.stringify(current)) {
    cachedSnapshot = current;
  }
  
  return cachedSnapshot;
}
```

### 2️⃣ **MainApp.jsx** - React Component

```javascript
function MainApp() {
  // External Store থেকে snapshot নিচ্ছি
  const modalState = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div>
      {/* Buttons to open Modal */}
      <button onClick={() => 
        iframeModalStore.openModal('Title', 'Message')
      }>
        Open Modal
      </button>

      {/* iframe Modal */}
      <iframe srcDoc={getIframeHTML()} />
    </div>
  );
}
```

### 3️⃣ **IframeModal.jsx** - iframe Content

```javascript
// HTML5 postMessage দিয়ে parent window এর সাথে communicate
window.addEventListener('message', (event) => {
  if (event.data.type === 'MODAL_OPEN') {
    openModal(event.data.title, event.data.message);
  }
});

// iframe থেকে parent এ message পাঠানো
window.parent.postMessage({
  type: 'MODAL_SUBMIT',
  value: userInput
}, '*');
```

---

## 📡 Communication Flow

### Step-by-Step Process:

```
1. USER INTERACTION (ব্যবহারকারী বাটন চাপে)
   ↓
2. openModal() CALLED (Store function call হয়)
   ↓
3. STATE UPDATED (_state object বদলায়)
   ↓
4. LISTENERS NOTIFIED (_notifyListeners() call হয়)
   ↓
5. useSync HOOK TRIGGERED (subscribe callback trigger হয়)
   ↓
6. getSnapshot() CALLED (বর্তমান snapshot নেওয়া হয়)
   ↓
7. SNAPSHOT CACHING CHECK (পুরনোর সাথে compare)
   ↓
8. COMPONENT RE-RENDER (React re-render করে)
   ↓
9. postMessage() SENT (iframe এ message পাঠানো হয়)
   ↓
10. IFRAME RECEIVES (iframe message শোনে)
   ↓
11. MODAL OPENS (iframe এ modal খুলে যায়)
   ↓
12. USER INPUT (ব্যবহারকারী input দেয়)
   ↓
13. postMessage() SENT BACK (iframe parent এ message পাঠায়)
   ↓
14. PARENT RECEIVES & UPDATES (parent state update করে)
   ↓
15. SYNC AGAIN (সম্পূর্ণ cycle repeat)
```


## 🎓 Snapshot Caching কেন গুরুত্বপূর্ণ?

### ❌ ভুল উপায় (Infinite Loop):

```javascript
function getSnapshot() {
  return {
    isOpen: store.isOpen,
    title: store.title
  }; // প্রতিবার নতুন object তৈরি হয়!
}

// কি হয়:
// 1. Component render হয়
// 2. getSnapshot() call → নতুন object
// 3. React: "বদলেছে!" → re-render
// 4. getSnapshot() call → আরেকটা নতুন object
// 5. React: "আবার বদলেছে!" → re-render
// 6. ... INFINITE LOOP! 💀
```

### ✅ সঠিক উপায় (Caching):

```javascript
let cachedSnapshot = null;

function getSnapshot() {
  const current = {
    isOpen: store.isOpen,
    title: store.title
  };

  // পুরনোর সাথে তুলনা করো
  if (!cachedSnapshot || 
      JSON.stringify(cachedSnapshot) !== JSON.stringify(current)) {
    cachedSnapshot = current; // শুধু প্রয়োজনে নতুন
  }

  return cachedSnapshot; // একই reference ফিরিয়ে দাও
}

// কি হয়:
// 1. Component render হয়
// 2. getSnapshot() call → তুলনা করে → same reference
// 3. React: "বদলেনি" → re-render করে না
// 4. No loop! ✅
```

---

## 🔄 Data Flow

### User Opens Modal:

```
┌─ Button Click
├─ modalStore.openModal('Title', 'Message')
├─ _state.isOpen = true
├─ _state.title = 'Title'
├─ _state.message = 'Message'
├─ postMessage to iframe {type: 'MODAL_OPEN', title, message}
├─ _notifyListeners()
├─ React subscribe callback triggers
├─ getSnapshot() returns {isOpen: true, title: 'Title', ...}
├─ cachedSnapshot updates
├─ Component re-renders
└─ UI shows Modal is Open
```

### User Types in Input:

```
┌─ Input onChange event in iframe
├─ sendInputChange() function called
├─ postMessage to parent {type: 'INPUT_CHANGE', value}
├─ Parent receives message
├─ modalStore.setInput(value)
├─ _state.userInput = value
├─ _notifyListeners()
├─ getSnapshot() returns updated snapshot
├─ Component re-renders
└─ UI shows new input value
```

### User Submits Modal:

```
┌─ Submit button clicked in iframe
├─ postMessage to parent {type: 'MODAL_SUBMIT', value}
├─ Parent receives message
├─ Show alert with user input
├─ modalStore.closeModal()
├─ _state.isOpen = false
├─ postMessage to iframe {type: 'MODAL_CLOSE'}
├─ _notifyListeners()
├─ getSnapshot() returns {isOpen: false, ...}
├─ Component re-renders
├─ iframe receives MODAL_CLOSE message
├─ iframe Modal disappears
└─ Back to initial state
```

---

## 💻 Usage Example

### Modal খোলার উপায়:

```javascript
import { iframeModalStore } from './components/Store';

// Newsletter Modal
iframeModalStore.openModal(
  '📧 সাবস্ক্রিপশন',
  'আমাদের নিউজলেটার সাবস্ক্রাইব করুন'
);

// Feedback Modal
iframeModalStore.openModal(
  '💬 Feedback',
  'আপনার মতামত শেয়ার করুন'
);

// Warning Modal
iframeModalStore.openModal(
  '⚠️ Warning',
  'এই অ্যাকশনটি বাতিল করা যাবে না'
);
```

### Modal বন্ধের উপায়:

```javascript
iframeModalStore.closeModal();
```

### Current State পেতে:

```javascript
import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from './components/Store';

function MyComponent() {
  const modalState = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div>
      <p>Modal Open: {modalState.isOpen ? 'Yes' : 'No'}</p>
      <p>Title: {modalState.title}</p>
      <p>User Input: {modalState.userInput}</p>
    </div>
  );
}
```

---

## 📚 React Hooks Used

### 🪝 useSyncExternalStore

External store এর সাথে component কে sync করে।

```javascript
const snapshot = useSyncExternalStore(subscribe, getSnapshot);
```

**Parameters:**
- `subscribe`: callback ফাংশন, store change হলে call হয়
- `getSnapshot`: বর্তমান state এর snapshot দেয়

**Returns:**
- `snapshot`: current state object

### 🪝 useEffect

iframe reference set করা এবং message listener add করা।

```javascript
useEffect(() => {
  iframeModalStore.setIframeRef(iframeRef.current);
  
  const handleMessage = (event) => {
    if (event.data.type === 'INPUT_CHANGE') {
      iframeModalStore.setInput(event.data.value);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### 🪝 useRef

iframe DOM element এর reference রাখা।

```javascript
const iframeRef = useRef(null);

<iframe ref={iframeRef} srcDoc={getIframeHTML()} />
```

---

## 🛠️ Advanced Features

### Custom Modal Dialogs তৈরি করা:

```javascript
// আপনার নিজস্ব dialog type যোগ করুন
iframeModalStore.openModal(
  'Custom Dialog',
  'Your custom message here'
);
```

### Input Validation:

```javascript
// Store এ validation যোগ করুন
setInput(value) {
  if (value.length <= 100) { // ১০০ character limit
    this._state.userInput = value;
    this._notifyListeners();
  }
}
```

### Error Handling:

```javascript
// postMessage এ error handling
if (this._state.iframeRef?.contentWindow) {
  try {
    this._state.iframeRef.contentWindow.postMessage({...}, '*');
  } catch (error) {
    console.error('postMessage failed:', error);
  }
}
```

---

## 🔐 Security Considerations

### ⚠️ postMessage Security:

```javascript
// ❌ নিরাপদ নয় - সব origin থেকে message receive
window.addEventListener('message', handler); // '*' default

// ✅ নিরাপদ - নির্দিষ্ট origin থেকেই receive
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://example.com') return;
  // message handle করো
});
```

### Data Validation:

```javascript
// iframe থেকে আসা data validate করো
if (event.data.type && 
    typeof event.data.value === 'string') {
  iframeModalStore.setInput(event.data.value);
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Modal not opening

```javascript
// ✅ Solution: iframe reference check করো
console.log(iframeModalStore._state.iframeRef); // null হওয়া উচিত নয়
```

### Issue 2: Input not syncing

```javascript
// ✅ Solution: message listener active আছে কিনা check করো
window.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
});
```

### Issue 3: Infinite loop or slow rendering

```javascript
// ✅ Solution: Snapshot caching check করো
function getSnapshot() {
  // পুরনো snapshot এর সাথে compare করতে ভুলোনা!
  if (!cachedSnapshot || changed) {
    cachedSnapshot = newSnapshot;
  }
  return cachedSnapshot;
}
```

---

## 📊 Performance Tips

### 1. Snapshot Caching করো
```javascript
// একই object reference রাখো যতক্ষণ না data বদলায়
```

### 2. Selective Subscriptions
```javascript
// শুধু প্রয়োজনীয় state subscribe করো
```

### 3. Debounce Input Changes
```javascript
// Fast input changes এর জন্য debounce করো
let debounceTimer;
function sendInputChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    window.parent.postMessage({type: 'INPUT_CHANGE', ...}, '*');
  }, 300);
}
```

---

## 📖 এই প্রজেক্ট থেকে শিখুন

### ✅ Concepts Covered:

| Topic | Description |
|-------|------------|
| **External Store** | React এর বাইরে data management |
| **useSyncExternalStore** | External store এর সাথে sync করা |
| **Snapshot Caching** | Infinite loop প্রতিরোধ করা |
| **HTML5 postMessage** | Cross-window communication |
| **iframe** | Isolated HTML context |
| **Listener Pattern** | Event-driven architecture |
| **State Management** | External state updates |

---

## 🤝 Contributing

এই প্রজেক্টে contribute করতে চাইলে:

1. Fork করো repository
2. Feature branch create করো (`git checkout -b feature/AmazingFeature`)
3. Changes commit করো (`git commit -m 'Add some AmazingFeature'`)
4. Branch push করো (`git push origin feature/AmazingFeature`)
5. Pull Request খোলো

---

## 📝 License

এই প্রজেক্ট MIT License এর অধীনে।
>>>>>>> 742c9fb (React iframe Modal - useSyncExternalStore)
