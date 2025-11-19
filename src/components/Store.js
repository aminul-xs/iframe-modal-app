// ============================================
// EXTERNAL STORE (iframe এর বাইরে)
// ============================================
export const iframeModalStore = {
    _state: {
        isOpen: false,
        title: 'Modal Title',
        message: 'Modal Message',
        userInput: '',
        iframeRef: null
    },

    _listeners: [],

    setIframeRef(ref) {
        this._state.iframeRef = ref;
    },

    openModal(title, message) {
        this._state.isOpen = true;
        this._state.title = title;
        this._state.message = message;
        this._state.userInput = '';

        // iframe এ message পাঠাও
        if (this._state.iframeRef?.contentWindow) {
            this._state.iframeRef.contentWindow.postMessage({
                type: 'MODAL_OPEN',
                title,
                message
            }, '*');
        }

        this._notifyListeners();
    },

    closeModal() {
        this._state.isOpen = false;

        // iframe এ বন্ধ করার message পাঠাও
        if (this._state.iframeRef?.contentWindow) {
            this._state.iframeRef.contentWindow.postMessage({
                type: 'MODAL_CLOSE'
            }, '*');
        }

        this._notifyListeners();
    },

    setInput(value) {
        this._state.userInput = value;
        this._notifyListeners();
    },

    _notifyListeners() {
        this._listeners.forEach(fn => fn());
    },

    subscribe(callback) {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(fn => fn !== callback);
        };
    }
};

// ============================================
// SNAPSHOT CACHING
// ============================================
let cachedSnapshot = null;

export function getSnapshot() {
    const current = {
        isOpen: iframeModalStore._state.isOpen,
        title: iframeModalStore._state.title,
        message: iframeModalStore._state.message,
        userInput: iframeModalStore._state.userInput
    };

    // ✅ সঠিক উপায়: পুরনো snapshot এর সাথে compare করো
    if (
        !cachedSnapshot ||
        JSON.stringify(cachedSnapshot) !== JSON.stringify(current)
    ) {
        cachedSnapshot = current;
        console.log('📸 Snapshot updated:', cachedSnapshot);
    } else {
        console.log('♻️ Reusing cached snapshot (no changes)');
    }

    return cachedSnapshot;
}

export function subscribe(callback) {
    return iframeModalStore.subscribe(callback);
}