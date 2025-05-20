// API-funksjoner for å kommunisere med PHP-backend
function api_getAnimals() {
    return fetch('php/get_animals.php')
        .then(response => response.json())
        .catch(error => {
            console.error('Feil ved henting av dyr:', error);
            return [];
        });
}

function api_getOwners() {
    return fetch('php/get_owners.php')
        .then(response => response.json())
        .catch(error => {
            console.error('Feil ved henting av eiere:', error);
            return [];
        });
}

function api_addAnimal(name, species, birth_date) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('species', species);
    formData.append('birth_date', birth_date);
    
    return fetch('php/add_animal.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Feil ved registrering av dyr:', error);
        return { status: 'error', message: 'Nettverksfeil ved registrering' };
    });
}

function api_addOwner(firstname, lastname, phone, email) {
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('phone', phone);
    formData.append('email', email);
    
    return fetch('php/add_owner.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Feil ved registrering av eier:', error);
        return { status: 'error', message: 'Nettverksfeil ved registrering' };
    });
}

function api_connectAnimalOwner(animal_id, owner_id) {
    const formData = new FormData();
    formData.append('animal_id', animal_id);
    formData.append('owner_id', owner_id);
    
    return fetch('php/connect_animal_owner.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Feil ved tilkobling av dyr til eier:', error);
        return { status: 'error', message: 'Nettverksfeil ved tilkobling' };
    });
}