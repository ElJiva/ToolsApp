const RAW_LIBRARY = {
  "martillo": {
    image: require("../../assets/tools/martillo_cover.png"),
    model: require("../../assets/tools/martillo.stl"),
    description: "Herramienta de percusión para clavar o deformar.",
  },
  "destornillador": {
    image: require("../../assets/tools/destornillador_cover.png"),
    model: require("../../assets/tools/destornillador.stl"),
    description: "Herramienta para apretar tornillos.",
  },
  "cintaamericana": {
    image: require("../../assets/tools/cinta_americana_cover.png"),
    model: require("../../assets/tools/cinta_americana.stl"),
    description: "Cinta adhesiva resistente.",
  },
  "cintametrica": {
    image: require("../../assets/tools/cinta_metrica_cover.png"),
    model: require("../../assets/tools/cinta_metrica.stl"),
    description: "Herramienta de medición.",
  },
  "llaveallen": {
    image: require("../../assets/tools/llave_allen_cover.png"),
    model: require("../../assets/tools/llave_allen.stl"),
    description: "Llave para tornillos hexagonales.",
  },
  "llaveboca": { // <--- Clave en minúsculas y sin espacios
    image: require("../../assets/tools/llave_boca_cover.png"),
    model: require("../../assets/tools/llave_boca.stl"),
    description: "Llave fija para tuercas.",
  },
  "llaveinglesa": {
    image: require("../../assets/tools/llave_inglesa_cover.png"),
    model: require("../../assets/tools/llave_inglesa.stl"),
    description: "Llave ajustable.",
  },
  "pinzas": {
    image: require("../../assets/tools/pinzas_cover.png"),
    model: require("../../assets/tools/pinzas.stl"),
    description: "Herramienta para sujetar.",
  },
  "tijeras": {
    image: require("../../assets/tools/tijeras_cover.png"),
    model: require("../../assets/tools/tijeras.stl"),
    description: "Herramienta para cortar.",
  },
  "default": {
    image: require("../../assets/adaptive-icon.png"),
    model: null,
    description: "Herramienta no identificada localmente.",
  },
};

// Función Inteligente para buscar
export const getToolData = (serverName) => {
  if (!serverName) return RAW_LIBRARY["default"];

  const normalizedKey = serverName.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
  
  return RAW_LIBRARY[normalizedKey] || RAW_LIBRARY["default"];
};