import { useSyncExternalStore, useEffect, useRef } from 'react';
import { iframeModalStore, getSnapshot, subscribe } from './Store';
import { getIframeHTML } from './IframeModal';
import styles from './MainApp.module.css';

export function MainApp() {
  const iframeRef = useRef(null);
  const modalState = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    // iframe কে reference দাও
    iframeModalStore.setIframeRef(iframeRef.current);

    // iframe থেকে আসা messages শুনো
    const handleMessage = (event) => {
      console.log('📨 Parent received:', event.data);
      
      if (event.data.type === 'INPUT_CHANGE') {
        iframeModalStore.setInput(event.data.value);
      }
      if (event.data.type === 'MODAL_SUBMIT') {
        console.log('✅ User submitted:', event.data.value);
        alert(`আপনার ইনপুট: ${event.data.value}`);
        iframeModalStore.closeModal();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={styles.container}>
      <h1>🌐 React + iframe Modal (useSyncExternalStore)</h1>
      
      <div className={styles.section}>
        <h2>📍 React Component (Main Page)</h2>
        <p>এখানে থেকে Modal খোলো এবং বন্ধ করো</p>

        <div className={styles.buttonGroup}>
          <button
            onClick={() => iframeModalStore.openModal(
              '📧 সাবস্ক্রিপশন',
              'আমাদের নিউজলেটার সাবস্ক্রাইব করুন এবং সর্বশেষ খবর পান'
            )}
            className={styles.mainBtn}
          >
            📬 Newsletter Open
          </button>

          <button
            onClick={() => iframeModalStore.openModal(
              '💬 Feedback',
              'আপনার মতামত এবং পরামর্শ আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ'
            )}
            className={styles.mainBtn}
          >
            💭 Feedback Open
          </button>

          <button
            onClick={() => iframeModalStore.openModal(
              '⚠️ Warning',
              'এই অ্যাকশনটি সম্পূর্ণ করতে চান? এটি বাতিল করা যাবে না।'
            )}
            style={{backgroundColor: '#ff9800'}}
            className={styles.mainBtn}
          >
            ⚠️ Warning Open
          </button>

          <button
            onClick={() => iframeModalStore.closeModal()}
            className={styles.closeBtn}
          >
            ❌ Close Modal
          </button>
        </div>

        <div className={styles.info}>
          <h3>📊 Current State (useSyncExternalStore):</h3>
          <div className={styles.stateBox}>
            <p><strong>✔️ Modal Open:</strong> <span className={modalState.isOpen ? styles.yes : styles.no}>{modalState.isOpen ? 'Yes' : 'No'}</span></p>
            <p><strong>📝 Title:</strong> {modalState.title}</p>
            <p><strong>💬 Message:</strong> {modalState.message}</p>
            <p><strong>📝 User Input:</strong> <code>{modalState.userInput || '(empty)'}</code></p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🖼️ iframe (Modal Inside)</h2>
        <p>এটা একটি আলাদা window context - HTML5 postMessage API দিয়ে communicate করে</p>
        
        <iframe
          ref={iframeRef}
          srcDoc={getIframeHTML()}
          className={styles.iframe}
          title="Modal iframe"
        />
      </div>

      {/* Communication Flow Diagram */}
      <div className={styles.section}>
        <h2>📡 Communication Flow</h2>
        <div className={styles.diagram}>
          <div className={styles.box}>
            <strong>React Component</strong><br/>
            <small>(Main Page)</small>
          </div>
          <div className={styles.arrow}>↕️</div>
          <div className={styles.box}>
            <strong>postMessage()</strong><br/>
            <small>(HTML5 API)</small>
          </div>
          <div className={styles.arrow}>↕️</div>
          <div className={styles.box}>
            <strong>iframe Window</strong><br/>
            <small>(Modal)</small>
          </div>
        </div>
      </div>
    </div>
  );
}