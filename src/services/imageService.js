import { imageApi } from './api';

export const imageService = {
    // Ladda upp en bild
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await imageApi.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Hämta bild-URL
    getImageUrl: (filename) => {
        const baseUrl = import.meta.env.VITE_IMAGE_API_URL || 'http://localhost:3000';
        return `${baseUrl}/images/${filename}`;
    },

    // Redigera bild med text
    editImageWithText: async (filename, text, x, y) => {
        const response = await imageApi.post(`/edit/${filename}`, {
            text,
            x,
            y,
        });
        return response.data;
    },

    // Redigera bild med flera actions (text och/eller ritning)
    editImageWithActions: async (filename, actions) => {
        const response = await imageApi.post(`/edit/${filename}`, {
            actions,
        });
        return response.data;
    },
};