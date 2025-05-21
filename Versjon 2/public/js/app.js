// Globale variabler
let owners = [];
let animals = [];
let recentActivity = [];

// DOM elementer
const navigationLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('main section');

// Event listeners for navigasjon
document.getElementById('dashboard-link').addEventListener('click', showDashboard);
document.getElementById('owners-link').addEventListener('click', showOwners);
document.getElementById('animals-link').addEventListener('click', showAnimals);
document.getElementById('about-link').addEventListener('click', showAbout);

// Event listeners for skjemaer
document.getElementById('add-owner-btn').addEventListener('click', showOwnerForm);
document.getElementById('cancel-owner-btn').addEventListener('click', hideOwnerForm);
document.getElementById('add-owner-form').addEventListener('submit', handleOwnerSubmit);

document.getElementById('add-animal-btn').addEventListener('click', showAnimalForm);
document.getElementById('cancel-animal-btn').addEventListener('click', hideAnimalForm);
document.getElementById('add-animal-form').addEventListener('submit', handleAnimalSubmit);

// Initialiser applikasjonen
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        await loadData();
        updateDashboard();
        populateOwnersTable();
        populateAnimalsTable();
    } catch (error) {
        showError('Kunne ikke laste data fra serveren. Sørg for at server kjører og at databasen er tilgjengelig.');
    }
}

// Laster data fra API
async function loadData() {
    try {
        animals = await getAnimals();
        owners = await getOwners();
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Viser feilmelding
function showError(message) {
    alert(message);
}

// Navigasjonsfunksjoner
function showDashboard(e) {
    if (e) e.preventDefault();
    setActiveSection('dashboard');
    updateDashboard();
}

function showOwners(e) {
    if (e) e.preventDefault();
    setActiveSection('owners');
}

function showAnimals(e) {
    if (e) e.preventDefault();
    setActiveSection('animals');
    populateOwnerDropdown();
}

function showAbout(e) {
    if (e) e.preventDefault();
    setActiveSection('about');
}

// Setter aktiv seksjon
function setActiveSection(sectionId) {
    // Oppdater navigasjonslenker
    navigationLinks.forEach(link => {
        if (link.id === `${sectionId}-link`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Vis riktig seksjon
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden-section');
            section.classList.add('active-section');
        } else {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        }
    });
}

// Dashboard-funksjoner
function updateDashboard() {
    document.getElementById('total-owners').textContent = owners.length;
    document.getElementById('total-animals').textContent = animals.length;
    
    const animalsWithoutOwner = animals.filter(animal => !animal.owner_id).length;
    document.getElementById('animals-no-owner').textContent = animalsWithoutOwner;
    
    updateRecentActivity();
}

function updateRecentActivity() {
    const recentActivityList = document.getElementById('recent-activity-list');
    recentActivityList.innerHTML = '';
    
    if (recentActivity.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Ingen nylige aktiviteter.';
        recentActivityList.appendChild(li);
        return;
    }
    
    // Vis de 5 siste aktivitetene
    recentActivity.slice(0, 5).forEach(activity => {
        const li = document.createElement('li');
        li.textContent = activity;
        recentActivityList.appendChild(li);
    });
}

function addActivity(activity) {
    const now = new Date();
    const time = now.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    recentActivity.unshift(`${time}: ${activity}`);
    
    // Behold kun de 10 siste aktivitetene
    if (recentActivity.length > 10) {
        recentActivity.pop();
    }
}

// Eier-funksjoner
function showOwnerForm() {
    document.getElementById('owner-form-container').classList.remove('hidden');
    document.getElementById('add-owner-form').reset();
}

function hideOwnerForm() {
    document.getElementById('owner-form-container').classList.add('hidden');
}

function populateOwnersTable() {
    const tbody = document.querySelector('#owners-table tbody');
    tbody.innerHTML = '';
    
    if (owners.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '