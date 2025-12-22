// --- TAB SWITCHER (Card vs AI) ---
function switchView(viewId, btn) {
    // 1. Hide all view containers
    const allViews = document.querySelectorAll('.view-container');
    allViews.forEach(view => {
        view.style.display = 'none'; // Force hide
        view.classList.remove('active');
    });

    // 2. Show the selected view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = 'block'; // Force show
        setTimeout(() => targetView.classList.add('active'), 10); // Add fade animation
    }

    // 3. Update Tab Buttons (Active State)
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    
    // Highlight the clicked button
    if (btn) {
        btn.classList.add('active');
    }
}

// --- MODALS (Battery) ---
function openBatteryModal() {
    document.getElementById("battery-modal").style.display = "flex";
}

function closeBatteryModal(event) {
    if (event.target.id === "battery-modal") {
        document.getElementById("battery-modal").style.display = "none";
    }
}

// --- UTILS ---
function copyToClipboard() {
    const text = document.getElementById("userid-text").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied: " + text);
    });
}

function resetChat() {
    const chatArea = document.querySelector(".chat-area");
    if(chatArea) {
        chatArea.innerHTML = '<div class="msg ai">Chat cleared. Ask me anything about your chart!</div>';
    }
}

// Initialize: Ensure 'card' is visible on load
document.addEventListener('DOMContentLoaded', () => {
    switchView('card', document.querySelector('.tab-btn.active'));
});