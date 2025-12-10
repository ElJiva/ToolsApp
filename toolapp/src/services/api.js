
const API_URL = 'http:/192.168.100.13:5050'; 

export const getImageUrl = (filename) => {
    if (!filename) return null;
    return `${API_URL}/static/${filename}`; 
};

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
        // Envio de foto a python
        const response = await fetch(`${API_URL}/detectar`, {
            method: 'POST',
            body: formData,
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
        
        const json = await response.json();

        // MAPEO DE DATOS (Python -> React Native)
        return {
            toolName: json.herramienta,      
            stlFile: json.archivo_stl,        
            hologramImage: getImageUrl(json.imagen_frontend), 
            confidence: json.confianza,     
            found: json.encontrado,         
            raw: json                         
        };

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

//Guardado de imagenes Tomadas en Base de Datos
export const saveScan = async (scanData) => {
    try {
        const response = await fetch(`${API_URL}/historial`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                herramienta_detectada: scanData.toolName,
                confianza: scanData.confidence,
                archivo_stl: scanData.stlFile,
                imagen_frontend: scanData.raw.imagen_frontend, 
                fecha: new Date().toISOString() 
            }),
        });

        if (!response.ok) {
            throw new Error('El servidor rechazó el guardado');
        }

        return await response.json();
    } catch (error) {
        console.error("Error al guardar en historial:", error);
        throw error; 
    }
};