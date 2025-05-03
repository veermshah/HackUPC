export function generarPromptDesdeJSON(
    data: { name: string; answers: Record<string, string> }[]
): string {
    let prompt = `Estas son las respuestas de un grupo de personas sobre sus preferencias de viaje:\n\n`;

    data.forEach((persona, index) => {
        prompt += `Persona ${index + 1} - ${persona.name}:\n`;
        for (const [key, value] of Object.entries(persona.answers)) {
            prompt += `- ${key}: ${value}\n`;
        }
        prompt += "\n";
    });

    prompt += `
 Con base en estas respuestas, devuelve lo siguiente en formato JSON (sin explicaciones):
 
 1. "intereses_comunes": Un texto breve (1 o 2 frases) con al menos un interés común, aunque sea general (como "viajar en verano", "prefieren climas suaves", etc.). Nunca debe estar vacío.
 
 2. "destinos_sugeridos": Una lista de 3 destinos recomendados. Para cada destino incluye:
   - "nombre": nombre del destino.
   - "iata": código IATA del aeropuerto principal de esa ciudad.
   - "estimacion_co2": cantidad estimada de CO₂ (en kg) emitidos por toda la ciudad en un día típico de la fecha del viaje.
   - "lugares_destacados": al menos 2 lugares importantes con:
       - "nombre"
       - "descripcion"
       - "restaurantes": lista de 3 restaurantes cercanos que ofrezcan comida típica local. Cada restaurante debe tener:
           - "nombre"
           - "ubicacion": dirección legal completa
           - "tipo": tipo de cocina o estilo de restaurante, en caso de que no sea comida local
 
 3. "eventos": Una lista de eventos relevantes que ocurran durante las fechas indicadas por los usuarios. Debe haber al menos 1 evento por cada lugar destacado en cada destino sugerido. Para cada evento, incluye:
   - "ubicacion": dirección exacta
   - "hora": hora exacta o aproximada del evento
   - "descripcion"
 
 Devuelve **solo** este JSON:
 `;

    console.log("Prompt generado:", prompt);
    return prompt;
}
