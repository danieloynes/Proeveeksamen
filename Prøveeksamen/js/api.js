/**
 * API functions for communicating with the backend
 */

// Base URL for API requests
const API_BASE_URL = 'php/';

/**
 * Get all animals
 * @returns {Promise} Promise object with animal data
 */
async function getAnimals() {
    try {
        const response = await fetch(`${API_BASE_URL}get_animals.php`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching animals:', error);
        return [];
    }
}

/**
 * Get all owners
 * @returns {Promise} Promise object with owner data
 */
async function getOwners() {
    try {
        const response = await fetch(`${API_BASE_URL}get_owners.php`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching owners:', error);
        return [];
    }
}

/**
 * Add a new animal
 * @param {Object} animalData - The animal data to be added
 * @returns {Promise} Promise object with response data
 */
async function addAnimal(animalData) {
    try {
        const formData = new FormData();
        for (const key in animalData) {
            formData.append(key, animalData[key]);
        }
        
        const response = await fetch(`${API_BASE_URL}add_animal.php`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding animal:', error);
        return { success: false, message: 'Failed to add animal' };
    }
}

/**
 * Add a new owner
 * @param {Object} ownerData - The owner data to be added
 * @returns {Promise} Promise object with response data
 */
async function addOwner(ownerData) {
    try {
        const formData = new FormData();
        for (const key in ownerData) {
            formData.append(key, ownerData[key]);
        }
        
        const response = await fetch(`${API_BASE_URL}add_owner.php`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding owner:', error);
        return { success: false, message: 'Failed to add owner' };
    }
}

/**
 * Connect an animal to an owner
 * @param {number} animalId - The animal ID
 * @param {number} ownerId - The owner ID
 * @returns {Promise} Promise object with response data
 */
async function connectAnimalOwner(animalId, ownerId) {
    try {
        const formData = new FormData();
        formData.append('animal_id', animalId);
        formData.append('owner_id', ownerId);
        
        const response = await fetch(`${API_BASE_URL}connect_animal_owner.php`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error connecting animal to owner:', error);
        return { success: false, message: 'Failed to connect animal to owner' };
    }
}