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
// --- UTILITIES ---
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function switchView(viewId, btn) {
    document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    btn.classList.add('active');
}
function copyToClipboard() {
    const text = document.getElementById('userid-text').innerText;
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text);
}

// --- PROFILE EDIT LOGIC ---
function previewDP(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('edit-dp-preview').src = e.target.result; }
        reader.readAsDataURL(input.files[0]);
    }
}
function saveProfile() {
    const name = document.getElementById('edit-name').value;
    const bio = document.getElementById('edit-bio').value;
    const dpSrc = document.getElementById('edit-dp-preview').src;
    
    // Update main UI
    if(name) document.getElementById('display-name').innerText = name;
    if(bio) document.getElementById('display-bio').innerText = bio;
    document.getElementById('user-dp').src = dpSrc;
    
    // Here you would typically send DOB, Time, Location to backend
    alert('Profile Updated Successfully!');
    closeModal('modal-edit-profile');
}

// --- KARMA LOGIC ---
function addKarma(points) {
    const el = document.getElementById('karma-val');
    let current = parseInt(el.innerText);
    el.innerText = current + points;
    alert(`Woohoo! ${points} Karma added.`);
    closeModal('modal-karma');
}

// --- HIGHLIGHTS LOGIC ---
// Mock Database (Since no backend yet)
let highlightsData = {}; 
let currentOpenHighlight = null;

function createHighlight() {
    const name = document.getElementById('new-highlight-name').value;
    if(!name) return alert("Enter a name!");
    
    // Create HTML Circle
    const container = document.getElementById('highlights-container');
    const newDiv = document.createElement('div');
    newDiv.className = 'story-circle';
    newDiv.setAttribute('onclick', `viewHighlight('${name}')`);
    newDiv.innerHTML = `
        <div class="s-ring"><img src="https://via.placeholder.com/150" class="s-img" id="cover-${name}"></div>
        <span class="s-txt">${name}</span>
    `;
    
    // Add after the 'Add' button (which is first child)
    container.insertBefore(newDiv, container.children[1]);
    
    // Init Data
    highlightsData[name] = [];
    
    closeModal('modal-create-highlight');
    document.getElementById('new-highlight-name').value = '';
    
    // Open the view immediately to add photos
    viewHighlight(name);
}

function viewHighlight(name) {
    currentOpenHighlight = name;
    if(!highlightsData[name]) highlightsData[name] = []; // If accessing hardcoded ones
    
    document.getElementById('hl-title').innerText = name;
    renderHighlightGrid();
    openModal('modal-view-highlight');
}

function renderHighlightGrid() {
    const grid = document.getElementById('hl-grid');
    grid.innerHTML = '';
    const photos = highlightsData[currentOpenHighlight];
    
    photos.forEach((photoSrc, index) => {
        const div = document.createElement('div');
        div.className = 'hl-photo';
        div.innerHTML = `
            <img src="${photoSrc}">
            <div class="del-photo-btn" onclick="deletePhoto(${index})">X</div>
        `;
        grid.appendChild(div);
    });
}

function addPhotoToHighlight(input) {
    if (highlightsData[currentOpenHighlight].length >= 5) {
        return alert("Max 5 photos allowed per highlight!");
    }
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            highlightsData[currentOpenHighlight].push(e.target.result);
            renderHighlightGrid();
            
            // Update Cover Image on main screen (Use first image)
            const coverImg = document.getElementById(`cover-${currentOpenHighlight}`);
            if(coverImg) coverImg.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function deletePhoto(index) {
    highlightsData[currentOpenHighlight].splice(index, 1);
    renderHighlightGrid();
}

function deleteCurrentHighlight() {
    if(confirm("Delete this highlight?")) {
        // Remove from DOM logic would be complex without IDs, for now reloading or hiding
        // Ideally: Find the .story-circle with text == currentOpenHighlight and remove it.
        const circles = document.querySelectorAll('.story-circle');
        circles.forEach(c => {
            if(c.querySelector('.s-txt') && c.querySelector('.s-txt').innerText === currentOpenHighlight) {
                c.remove();
            }
        });
        delete highlightsData[currentOpenHighlight];
        closeModal('modal-view-highlight');
    }
}
