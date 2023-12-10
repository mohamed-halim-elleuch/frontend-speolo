import axios from 'axios';
const  apiKey = "ca01790d-7a39-3aff-591a-7df90419e78a:fx"

const baseURL = 'https://api-free.deepl.com/v2'; // Replace with the appropriate API endpoint

const entries = [
    { source: 'source1', target: 'target1' },
    { source: 'source2', target: 'target2' },
    // Add more entries as needed
  ];


const instance = axios.create({
  baseURL,
});

export const translateText = async (text, targetLang, glossaryId = null) => {
    const params = {
      auth_key: apiKey,
      text,
      target_lang: targetLang,
      glossary_id: glossaryId,
      // Add other customization options here
    };
  
    try {
      const response = await instance.post('/translate', null, { params });
      return response.data.translations[0].text;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  };


  // const id = await createGlossary('MyGlossary', entries);
export const createGlossary = async (name, entries) => {
  
    const glossaryData = {
      name,
      entries,
    };
  
    try {
      const response = await instance.post('/glossaries', glossaryData, {
        params: {
          auth_key: apiKey,
        },
      });
  
      return response.data.glossary.id;
    } catch (error) {
      console.error('Error creating glossary:', error);
      throw error;
    }
  };