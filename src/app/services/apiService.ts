export interface IImageData {
    dryer_model_id: number;
    correctlyAssembled: boolean;
    fileBase64: string;
  }
  
  export async function sendImageToApi(imageData: IImageData) {
    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }