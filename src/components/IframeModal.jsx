export function getIframeHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Modal iframe</title>
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f9f9f9;
          padding: 20px;
        }
        
        .welcome {
          text-align: center;
          color: #666;
          margin-top: 50px;
        }

        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-overlay.show {
          display: flex;
        }
        
        .modal {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 400px;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .modal-header h2 {
          font-size: 18px;
          color: white;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .close-btn:hover {
          opacity: 1;
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .modal-body p {
          margin-bottom: 15px;
          color: #666;
          line-height: 1.5;
        }
        
        .modal-body input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .modal-body input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .modal-footer {
          display: flex;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #eee;
          background: #f9f9f9;
        }
        
        .modal-footer button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: white;
          transition: all 0.2s;
        }
        
        .btn-close {
          background: #f44336;
        }
        
        .btn-close:hover {
          background: #da190b;
          transform: translateY(-2px);
        }
        
        .btn-submit {
          background: #4CAF50;
        }
        
        .btn-submit:hover {
          background: #388e3c;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="welcome">
        <h3>📱 Modal iframe</h3>
        <p>Parent page থেকে Modal খুলবে এখানে</p>
      </div>

      <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
          <div class="modal-header">
            <h2 id="modalTitle">Modal Title</h2>
            <button class="close-btn" onclick="closeModal()">✕</button>
          </div>
          
          <div class="modal-body">
            <p id="modalMessage">Modal Message</p>
            <input
              type="text"
              id="userInput"
              placeholder="আপনার মতামত লিখুন..."
              onchange="sendInputChange()"
            />
          </div>
          
          <div class="modal-footer">
            <button class="btn-close" onclick="closeModal()">বন্ধ করুন</button>
            <button class="btn-submit" onclick="submitModal()">জমা দিন</button>
          </div>
        </div>
      </div>

      <script>
        // Parent window থেকে messages শুনো
        window.addEventListener('message', (event) => {
          console.log('📬 iframe received:', event.data);
          
          if (event.data.type === 'MODAL_OPEN') {
            openModalFromParent(event.data.title, event.data.message);
          }
          if (event.data.type === 'MODAL_CLOSE') {
            closeModal();
          }
        });

        function openModalFromParent(title, message) {
          document.getElementById('modalTitle').textContent = title;
          document.getElementById('modalMessage').textContent = message;
          document.getElementById('userInput').value = '';
          document.getElementById('modalOverlay').classList.add('show');
          console.log('✅ Modal opened from parent');
        }

        function closeModal() {
          document.getElementById('modalOverlay').classList.remove('show');
          console.log('❌ Modal closed');
        }

        function sendInputChange() {
          const value = document.getElementById('userInput').value;
          window.parent.postMessage({
            type: 'INPUT_CHANGE',
            value: value
          }, '*');
          console.log('📤 iframe sent INPUT_CHANGE:', value);
        }

        function submitModal() {
          const value = document.getElementById('userInput').value;
          window.parent.postMessage({
            type: 'MODAL_SUBMIT',
            value: value
          }, '*');
          console.log('📤 iframe sent MODAL_SUBMIT:', value);
          closeModal();
        }
      </script>
    </body>
    </html>
  `;
}