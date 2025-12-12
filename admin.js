document.addEventListener('DOMContentLoaded', function () {
    // Navigation Handling
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageHeader = document.getElementById('page-header');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Hide all sections
            contentSections.forEach(section => section.classList.remove('active'));

            // Show target section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update Header Title
            const iconHTML = this.querySelector('i').outerHTML;
            const text = this.textContent.trim();
            pageHeader.innerHTML = `${text}`;
        });
    });

    // Modal Handling
    const addRoomBtn = document.getElementById('add-room-btn');
    const addRoomModal = document.getElementById('add-room-modal');
    const closeModal = document.querySelector('.close-modal');
    const addRoomForm = document.getElementById('add-room-form');

    if (addRoomBtn && addRoomModal) {
        addRoomBtn.addEventListener('click', () => {
            addRoomModal.style.display = 'flex';
        });
    }

    if (closeModal && addRoomModal) {
        closeModal.addEventListener('click', () => {
            addRoomModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addRoomModal) {
            addRoomModal.style.display = 'none';
        }
    });

    // Handle Add Room Form Submission
    if (addRoomForm) {
        addRoomForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('room-name').value;
            const type = document.getElementById('room-type').value;
            const price = document.getElementById('room-price').value;
            const status = document.getElementById('room-status').value;
            const imageInput = document.getElementById('room-image');

            // Create a fake image URL (placeholder) if no file selected, or use a generic one
            // In a real app, we'd handle the file upload here.
            // For static demo, we'll just use a placeholder based on type.
            let imgSrc = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=100';
            if (imageInput.files && imageInput.files[0]) {
                // Create a local object URL for the uploaded file to show it immediately
                imgSrc = URL.createObjectURL(imageInput.files[0]);
            }

            // Determine status class
            let statusClass = 'available';
            if (status === 'Occupied') statusClass = 'occupied';
            if (status === 'Maintenance') statusClass = 'maintenance';

            // Create new row HTML
            const newRow = `
                <tr>
                    <td><img src="${imgSrc}" alt="Room" class="table-img"></td>
                    <td>${name}</td>
                    <td>${type}</td>
                    <td>₱${parseInt(price).toLocaleString()}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                    <td>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;

            // Append to table
            const tableBody = document.getElementById('rooms-table-body');
            tableBody.insertAdjacentHTML('beforeend', newRow);

            // Reset form and close modal
            addRoomForm.reset();
            addRoomModal.style.display = 'none';

            // Optional: Show a success message (simple alert for now)
            alert('Room added successfully!');
        });
    }

    // Delete Button Functionality (Event Delegation)
    document.addEventListener('click', function (e) {
        if (e.target.closest('.delete')) {
            if (confirm('Are you sure you want to delete this item?')) {
                const row = e.target.closest('tr');
                row.remove();
            }
        }
    });
});
