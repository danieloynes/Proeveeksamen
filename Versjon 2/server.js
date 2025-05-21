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
        td.setAttribute('colspan', '6');
        td.textContent = 'Ingen eiere registrert';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    owners.forEach(owner => {
        const tr = document.createElement('tr');
        
        // Legg til celler for hver egenskap
        const idTd = document.createElement('td');
        idTd.textContent = owner.id;
        tr.appendChild(idTd);
        
        const firstnameTd = document.createElement('td');
        firstnameTd.textContent = owner.firstname;
        tr.appendChild(firstnameTd);
        
        const lastnameTd = document.createElement('td');
        lastnameTd.textContent = owner.lastname;
        tr.appendChild(lastnameTd);
        
        const phoneTd = document.createElement('td');
        phoneTd.textContent = owner.phone;
        tr.appendChild(phoneTd);
        
        const emailTd = document.createElement('td');
        emailTd.textContent = owner.email;
        tr.appendChild(emailTd);
        
        const actionsTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Slett';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => handleDeleteOwner(owner.id));
        actionsTd.appendChild(deleteBtn);
        
        tr.appendChild(actionsTd);
        tbody.appendChild(tr);
    });
}

async function handleOwnerSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const ownerData = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        email: formData.get('email')
    };
    
    try {
        const newOwner = await addOwner(ownerData);
        owners.push(newOwner);
        
        hideOwnerForm();
        populateOwnersTable();
        addActivity(`Ny eier lagt til: ${newOwner.firstname} ${newOwner.lastname}`);
        updateDashboard();
        
        // Oppdater eier-dropdown for dyr
        populateOwnerDropdown();
    } catch (error) {
        showError('Kunne ikke legge til eier. Vennligst prøv igjen.');
    }
}

async function handleDeleteOwner(id) {
    const ownerToDelete = owners.find(owner => owner.id === id);
    
    // Sjekk om eieren har dyr
    const ownerHasAnimals = animals.some(animal => animal.owner_id === id);
    
    if (ownerHasAnimals) {
        const confirm = window.confirm(
            `Eier ${ownerToDelete.firstname} ${ownerToDelete.lastname} har dyr registrert. ` +
            'Disse dyrene vil bli satt uten eier hvis du fortsetter. Vil du fortsette?'
        );
        
        if (!confirm) return;
    } else {
        const confirm = window.confirm(
            `Er du sikker på at du vil slette eier ${ownerToDelete.firstname} ${ownerToDelete.lastname}?`
        );
        
        if (!confirm) return;
    }
    
    try {
        await deleteOwner(id);
        
        // Oppdater dyr som tilhørte denne eieren
        animals = animals.map(animal => {
            if (animal.owner_id === id) {
                return { ...animal, owner_id: null };
            }
            return animal;
        });
        
        // Fjern eieren fra listen
        owners = owners.filter(owner => owner.id !== id);
        
        populateOwnersTable();
        populateAnimalsTable();
        addActivity(`Eier slettet: ${ownerToDelete.firstname} ${ownerToDelete.lastname}`);
        updateDashboard();
    } catch (error) {
        showError('Kunne ikke slette eier. Vennligst prøv igjen.');
    }
}

// Dyr-funksjoner
function showAnimalForm() {
    document.getElementById('animal-form-container').classList.remove('hidden');
    document.getElementById('add-animal-form').reset();
    populateOwnerDropdown();
}

function hideAnimalForm() {
    document.getElementById('animal-form-container').classList.add('hidden');
}

function populateOwnerDropdown() {
    const dropdown = document.getElementById('owner_id');
    dropdown.innerHTML = '<option value="">Ingen eier</option>';
    
    owners.forEach(owner => {
        const option = document.createElement('option');
        option.value = owner.id;
        option.textContent = `${owner.firstname} ${owner.lastname}`;
        dropdown.appendChild(option);
    });
}

function populateAnimalsTable() {
    const tbody = document.querySelector('#animals-table tbody');
    tbody.innerHTML = '';
    
    if (animals.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '6');
        td.textContent = 'Ingen dyr registrert';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    animals.forEach(animal => {
        const tr = document.createElement('tr');
        
        // Legg til celler for hver egenskap
        const idTd = document.createElement('td');
        idTd.textContent = animal.id;
        tr.appendChild(idTd);
        
        const nameTd = document.createElement('td');
        nameTd.textContent = animal.name;
        tr.appendChild(nameTd);
        
        const speciesTd = document.createElement('td');
        speciesTd.textContent = animal.species;
        tr.appendChild(speciesTd);
        
        const birthDateTd = document.createElement('td');
        birthDateTd.textContent = new Date(animal.birth_date).toLocaleDateString('no-NO');
        tr.appendChild(birthDateTd);
        
        const ownerTd = document.createElement('td');
        if (animal.owner_id) {
            const owner = owners.find(o => o.id === animal.owner_id);
            if (owner) {
                ownerTd.textContent = `${owner.firstname} ${owner.lastname}`;
            } else {
                ownerTd.textContent = 'Ukjent eier';
            }
        } else {
            ownerTd.textContent = 'Ingen eier';
        }
        tr.appendChild(ownerTd);
        
        const actionsTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Slett';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => handleDeleteAnimal(animal.id));
        actionsTd.appendChild(deleteBtn);
        
        tr.appendChild(actionsTd);
        tbody.appendChild(tr);
    });
}

async function handleAnimalSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const animalData = {
        name: formData.get('name'),
        species: formData.get('species'),
        birth_date: formData.get('birth_date'),
        owner_id: formData.get('owner_id') || null
    };
    
    try {
        const newAnimal = await addAnimal(animalData);
        animals.push(newAnimal);
        
        hideAnimalForm();
        populateAnimalsTable();
        
        let activityText = `Nytt dyr lagt til: ${newAnimal.name} (${newAnimal.species})`;
        if (newAnimal.owner_id) {
            const owner = owners.find(o => o.id === parseInt(newAnimal.owner_id));
            if (owner) {
                activityText += ` - Eier: ${owner.firstname} ${owner.lastname}`;
            }
        }
        
        addActivity(activityText);
        updateDashboard();
    } catch (error) {
        showError('Kunne ikke legge til dyr. Vennligst prøv igjen.');
    }
}

async function handleDeleteAnimal(id) {
    const animalToDelete = animals.find(animal => animal.id === id);
    
    const confirm = window.confirm(
        `Er du sikker på at du vil slette dyret ${animalToDelete.name}?`
    );
    
    if (!confirm) return;
    
    try {
        await deleteAnimal(id);
        
        // Fjern dyret fra listen
        animals = animals.filter(animal => animal.id !== id);
        
        populateAnimalsTable();
        addActivity(`Dyr slettet: ${animalToDelete.name}`);
        updateDashboard();
    } catch (error) {
        showError('Kunne ikke slette dyr. Vennligst prøv igjen.');
    }
}