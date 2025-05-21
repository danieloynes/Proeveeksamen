/**
 * Main JavaScript file for the Dyreklinikk application
 */

// DOM Elements
let animalsTableBody;
let ownersTableBody;
let animalForm;
let ownerForm;
let connectForm;
let ownerSelect;
let animalSelect;
let ownerSelectForConnect;

// Store data for animals and owners
let animals = [];
let owners = [];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements
    animalsTableBody = document.getElementById('animals-table-body');
    ownersTableBody = document.getElementById('owners-table-body');
    animalForm = document.getElementById('animal-form');
    ownerForm = document.getElementById('owner-form');
    connectForm = document.getElementById('connect-form');
    ownerSelect = document.getElementById('owner-select');
    animalSelect = document.getElementById('animal-select');
    ownerSelectForConnect = document.getElementById('owner-select-connect');
    
    // Setup event listeners
    animalForm.addEventListener('submit', handleAnimalSubmit);
    ownerForm.addEventListener('submit', handleOwnerSubmit);
    connectForm.addEventListener('submit', handleConnectSubmit);
    
    // Initialize tab functionality
    setupTabs();
    
    // Load initial data
    await loadData();
});

/**
 * Load all data from the API
 */
async function loadData() {
    // Show loading indicator
    showLoadingIndicator(true);
    
    // Fetch animals and owners data
    animals = await getAnimals();
    owners = await getOwners();
    
    // Update the UI
    updateAnimalsTable();
    updateOwnersTable();
    updateSelects();
    
    // Hide loading indicator
    showLoadingIndicator(false);
}

/**
 * Update the animals table with current data
 */
function updateAnimalsTable() {
    // Clear existing table content
    animalsTableBody.innerHTML = '';
    
    // Add each animal to the table
    animals.forEach(animal => {
        const row = document.createElement('tr');
        
        // Format the birth date
        let birthDate = animal.birth_date ? new Date(animal.birth_date).toLocaleDateString('nb-NO') : '-';
        
        row.innerHTML = `
            <td>${animal.name}</td>
            <td>${animal.species}</td>
            <td>${birthDate}</td>
            <td>${animal.owner_name || 'Ingen eier'}</td>
            <td>${animal.owner_phone || '-'}</td>
            <td>${animal.owner_email || '-'}</td>
        `;
        
        animalsTableBody.appendChild(row);
    });
    
    // Show message if no animals
    if (animals.length === 0) {
        animalsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Ingen dyr registrert</td></tr>';
    }
}

/**
 * Update the owners table with current data
 */
function updateOwnersTable() {
    // Clear existing table content
    ownersTableBody.innerHTML = '';
    
    // Add each owner to the table
    owners.forEach(owner => {
        const row = document.createElement('tr');
        
        // Get animals for this owner
        const ownerAnimals = animals.filter(animal => animal.owner_id === owner.id);
        const animalsList = ownerAnimals.map(animal => animal.name).join(', ');
        
        row.innerHTML = `
            <td>${owner.firstname} ${owner.lastname}</td>
            <td>${owner.phone || '-'}</td>
            <td>${owner.email || '-'}</td>
            <td>${animalsList || 'Ingen dyr'}</td>
        `;
        
        ownersTableBody.appendChild(row);
    });
    
    // Show message if no owners
    if (owners.length === 0) {
        ownersTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Ingen eiere registrert</td></tr>';
    }
}

/**
 * Update all select elements with current data
 */
function updateSelects() {
    // Clear existing options
    ownerSelect.innerHTML = '<option value="">Ingen eier</option>';
    animalSelect.innerHTML = '';
    ownerSelectForConnect.innerHTML = '';
    
    // Add owner options
    owners.forEach(owner => {
        const option = document.createElement('option');
        option.value = owner.id;
        option.textContent = `${owner.firstname} ${owner.lastname}`;
        
        ownerSelect.appendChild(option.cloneNode(true));
        ownerSelectForConnect.appendChild(option);
    });
    
    // Add animal options (only ones without owners for the connect form)
    animals.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = `${animal.name} (${animal.species})`;
        
        // Only add animals that don't have an owner to the connect form
        if (!animal.owner_id) {
            animalSelect.appendChild(option);
        }
    });
    
    // Show messages if no options
    if (animals.filter(a => !a.owner_id).length === 0) {
        animalSelect.innerHTML = '<option value="">Ingen dyr uten eier</option>';
    }
    
    if (owners.length === 0) {
        ownerSelectForConnect.innerHTML = '<option value="">Ingen eiere registrert</option>';
    }
}

/**
 * Handle submission of the animal form
 * @param {Event} event - The form submission event
 */
async function handleAnimalSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('animal-name').value,
        species: document.getElementById('animal-species').value,
        birth_date: document.getElementById('animal-birth-date').value,
        owner_id: document.getElementById('owner-select').value
    };
    
    // Validate form data
    if (!formData.name || !formData.species) {
        showAlert('Navn og dyreart er påkrevd', 'error');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator(true);
    
    // Submit the form
    const result = await addAnimal(formData);
    
    if (result.success) {
        showAlert(result.message, 'success');
        animalForm.reset();
        await loadData();
    } else {
        showAlert(result.message, 'error');
    }
    
    // Hide loading indicator
    showLoadingIndicator(false);
}

/**
 * Handle submission of the owner form
 * @param {Event} event - The form submission event
 */
async function handleOwnerSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        firstname: document.getElementById('owner-firstname').value,
        lastname: document.getElementById('owner-lastname').value,
        phone: document.getElementById('owner-phone').value,
        email: document.getElementById('owner-email').value
    };
    
    // Validate form data
    if (!formData.firstname || !formData.lastname) {
        showAlert('Fornavn og etternavn er påkrevd', 'error');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator(true);
    
    // Submit the form
    const result = await addOwner(formData);
    
    if (result.success) {
        showAlert(result.message, 'success');
        ownerForm.reset();
        await loadData();
    } else {
        showAlert(result.message, 'error');
    }
    
    // Hide loading indicator
    showLoadingIndicator(false);
}

/**
 * Handle submission of the connect form
 * @param {Event} event - The form submission event
 */
async function handleConnectSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const animalId = document.getElementById('animal-select').value;
    const ownerId = document.getElementById('owner-select-connect').value;
    
    // Validate form data
    if (!animalId || !ownerId) {
        showAlert('Velg både dyr og eier', 'error');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator(true);
    
    // Submit the form
    const result = await connectAnimalOwner(animalId, ownerId);
    
    if (result.success) {
        showAlert(result.message, 'success');
        connectForm.reset();
        await loadData();
    } else {
        showAlert(result.message, 'error');
    }
    
    // Hide loading indicator
    showLoadingIndicator(false);
}

/**
 * Setup the tab functionality
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Show an alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error)
 */
function showAlert(message, type = 'info') {
    const alertElement = document.getElementById('alert');
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.display = 'block';
    
    // Hide the alert after 3 seconds
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

/**
 * Show or hide the loading indicator
 * @param {boolean} show - Whether to show the loading indicator
 */
function showLoadingIndicator(show) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = show ? 'block' : 'none';
}