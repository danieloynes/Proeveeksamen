// Håndtere faneskifting
function openTab(tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    document.getElementById(tabName).classList.add("active");
    
    // Finn og aktiver riktig fane-knapp
    const tabButtons = document.getElementsByClassName("tab");
    for (let i = 0; i < tabButtons.length; i++) {
        if (tabButtons[i].textContent.toLowerCase().includes(tabName.toLowerCase())) {
            tabButtons[i].classList.add("active");
        }
    }
    
    // Last data hvis nødvendig
    if (tabName === 'viewAnimals') {
        loadAnimals();
    } else if (tabName === 'viewOwners') {
        loadOwners();
    } else if (tabName === 'connectAnimalOwner') {
        loadAnimalAndOwnerOptions();
    }
}

// Registrere nytt dyr
function registerAnimal() {
    const name = document.getElementById('animalName').value;
    const species = document.getElementById('animalSpecies').value;
    const birthDate = document.getElementById('birthDate').value;
    
    if (!name || !species || !birthDate) {
        document.getElementById('animalMessage').textContent = 'Alle felt må fylles ut';
        document.getElementById('animalMessage').className = 'error-message';
        return;
    }
    
    // Bruk API for å legge til dyret
    api_addAnimal(name, species, birthDate)
        .then(response => {
            if (response.status === 'success') {
                document.getElementById('animalMessage').textContent = response.message;
                document.getElementById('animalMessage').className = 'success-message';
                document.getElementById('animalForm').reset();
                
                // Oppdater lister
                loadAnimalAndOwnerOptions();
            } else {
                document.getElementById('animalMessage').textContent = response.message;
                document.getElementById('animalMessage').className = 'error-message';
            }
        });
}

// Registrere ny eier
function registerOwner() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    if (!firstName || !lastName || !phone || !email) {
        document.getElementById('ownerMessage').textContent = 'Alle felt må fylles ut';
        document.getElementById('ownerMessage').className = 'error-message';
        return;
    }
    
    // Bruk API for å legge til eieren
    api_addOwner(firstName, lastName, phone, email)
        .then(response => {
            if (response.status === 'success') {
                document.getElementById('ownerMessage').textContent = response.message;
                document.getElementById('ownerMessage').className = 'success-message';
                document.getElementById('ownerForm').reset();
                
                // Oppdater lister
                loadAnimalAndOwnerOptions();
            } else {
                document.getElementById('ownerMessage').textContent = response.message;
                document.getElementById('ownerMessage').className = 'error-message';
            }
        });
}

// Koble dyr til eier
function connectAnimalOwner() {
    const animalId = parseInt(document.getElementById('animalSelect').value);
    const ownerId = parseInt(document.getElementById('ownerSelect').value);
    
    if (!animalId || !ownerId) {
        document.getElementById('connectionMessage').textContent = 'Velg både dyr og eier';
        document.getElementById('connectionMessage').className = 'error-message';
        return;
    }
    
    // Bruk API for å koble dyr til eier
    api_connectAnimalOwner(animalId, ownerId)
        .then(response => {
            if (response.status === 'success') {
                document.getElementById('connectionMessage').textContent = response.message;
                document.getElementById('connectionMessage').className = 'success-message';
                document.getElementById('connectionForm').reset();
                
                // Oppdater lister
                loadAnimals();
                loadOwners();
                loadAnimalAndOwnerOptions();
            } else {
                document.getElementById('connectionMessage').textContent = response.message;
                document.getElementById('connectionMessage').className = 'error-message';
            }
        });
}

// Last dyr- og eier-alternativer for tilkoblingsformen
function loadAnimalAndOwnerOptions() {
    const animalSelect = document.getElementById('animalSelect');
    const ownerSelect = document.getElementById('ownerSelect');
    
    // Tøm eksisterende valg
    animalSelect.innerHTML = '<option value="">Velg dyr</option>';
    ownerSelect.innerHTML = '<option value="">Velg eier</option>';
    
    // Hent og legg til dyr
    api_getAnimals()
        .then(animals => {
            animals.forEach(animal => {
                const option = document.createElement('option');
                option.value = animal.id;
                option.textContent = `${animal.name} (${animal.species})`;
                animalSelect.appendChild(option);
            });
        });
    
    // Hent og legg til eiere
    api_getOwners()
        .then(owners => {
            owners.forEach(owner => {
                const option = document.createElement('option');
                option.value = owner.id;
                option.textContent = `${owner.firstname} ${owner.lastname}`;
                ownerSelect.appendChild(option);
            });
        });
}

// Last alle dyr
function loadAnimals() {
    const tableBody = document.getElementById('animalsTableBody');
    tableBody.innerHTML = '';
    
    api_getAnimals()
        .then(animals => {
            animals.forEach(animal => {
                const row = document.createElement('tr');
                
                // Bestem eier-navn
                let ownerName = 'Ingen eier';
                if (animal.owner_id && animal.firstname && animal.lastname) {
                    ownerName = `${animal.firstname} ${animal.lastname}`;
                }
                
                row.innerHTML = `
                    <td>${animal.id}</td>
                    <td>${animal.name}</td>
                    <td>${animal.species}</td>
                    <td>${formatDate(animal.birth_date)}</td>
                    <td>${ownerName}</td>
                `;
                
                tableBody.appendChild(row);
            });
        });
}

// Last alle eiere
function loadOwners() {
    const tableBody = document.getElementById('ownersTableBody');
    tableBody.innerHTML = '';
    
    api_getOwners()
        .then(owners => {
            owners.forEach(owner => {
                const row = document.createElement('tr');
                
                // Lag liste over dyr
                const animalsList = owner.animals && owner.animals.length 
                    ? owner.animals.map(a => `${a.name} (${a.species})`).join(', ') 
                    : 'Ingen dyr';
                
                row.innerHTML = `
                    <td>${owner.id}</td>
                    <td>${owner.firstname}</td>
                    <td>${owner.lastname}</td>
                    <td>${owner.phone}</td>
                    <td>${owner.email}</td>
                    <td>${animalsList}</td>
                `;
                
                tableBody.appendChild(row);
            });
        });
}

// Formater dato til norsk format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO');
}

// Initialiser applikasjonen
document.addEventListener('DOMContentLoaded', function() {
    loadAnimals();
    loadAnimalAndOwnerOptions();
});