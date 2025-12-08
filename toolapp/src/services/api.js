
const API_URL = "Aqui va la Direccion Ip de la Computadora"; 

export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        return await response.json();
    } catch (error) {
        console.error("Error conectando al servidor:", error);
        return null;
    }
};

export const detectTool = async (imageUri) => {
    const formData = new FormData();
    

    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('foto', {
        uri: imageUri,
        name: filename,
        type: type,
    });

    try {
        const response = await fetch(`${API_URL}/detectar`, {
            method: 'POST',
            body: formData,
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        throw error;
    }
};

export const getHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/historial`);
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo historial:", error);
        return [];
    }
};