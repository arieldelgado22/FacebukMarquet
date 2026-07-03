const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const image = new Image();

    reader.onload = () => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

async function fileToCompressedDataUrl(file) {
  const image = await readFileAsImage(file);
  const maxSize = 900;
  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = Math.round(image.width * ratio);
  canvas.height = Math.round(image.height * ratio);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.82);
}

export async function uploadProductImage(file) {
  if (!file) {
    return '';
  }

  if (imgbbApiKey) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('No se pudo subir la imagen a ImgBB.');
    }

    const result = await response.json();
    return result.data.url;
  }

  return fileToCompressedDataUrl(file);
}
