// API-endepunkt
const API_URL = 'http://localhost:3000/api';

/**
 * Henter alle dyr fra API
 * @returns {Promise<Array>} Liste med dyr
 */
async function getAnimals() {
    try {
        const response = await fetch(`${API_URL}/animals`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching animals:', error);
        throw error;
    }
}

/**
 * Henter alle eiere fra API
 * @returns {Promise<Array>} Liste med eiere
 */
async function getOwners() {
    try {
        const response = await fetch(`${API_URL}/owners`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching owners:', error);
        throw error;
    }
}

/**
 * Sletter en eier
 * @param {number} id - ID til eieren som skal slettes
 * @returns {Promise<Object>} Respons fra API
 */
async function deleteOwner(id) {
    try {
        const response = await fetch(`${API_URL}/owners/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting owner:', error);
        throw error;
    }
}

/**
 * Legger til en ny eier
 * @param {Object} ownerData - Data for den nye eieren
 * @returns {Promise<Object>} Den nye eieren med ID
 */
async function addOwner(ownerData) {
    try {
        const response = await fetch(`${API_URL}/owners`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ownerData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding owner:', error);
        throw error;
    }
}

/**
 * Sletter et dyr
 * @param {number} id - ID til dyret som skal slettes
 * @returns {Promise<Object>} Respons fra API
 */
async function deleteAnimal(id) {
    try {
        const response = await fetch(`${API_URL}/animals/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting animal:', error);
        throw error;
    }
}

/**
 * Legger til et nytt dyr
 * @param {Object} animalData - Data for det nye dyret
 * @returns {Promise<Object>} Det nye dyret med ID
 */
async function addAnimal(animalData) {
    try {
        const response = await fetch(`${API_URL}/animals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(animalData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding animal:', error);
        throw error;
    }
}