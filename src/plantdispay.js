async function fetchPlants() {
    try {
        const response = await fetch('/display');
        if (!response.ok) {
            throw new Error('Failed to fetch plants');
        }
        const plants = await response.json();
        
        const plantList = document.getElementById('plantList');
        plantList.innerHTML = '';

        plants.forEach(plant => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = plant.name;
            const botanicalNameCell = document.createElement('td');
            botanicalNameCell.textContent = plant.Botanicalname;
            const priceCell = document.createElement('td');
            priceCell.textContent = plant.price;

            row.appendChild(nameCell);
            row.appendChild(botanicalNameCell);
            row.appendChild(priceCell);
            plantList.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching plants:', error);
        alert('Error fetching plants. Please check the console for details.');
    }
}

fetchPlants();