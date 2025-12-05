import { IMGUR_CLIENT_ID, API_URL } from '../constants';
import type { ImgurResponse, ImgurErrorResponse } from '../types';

export const uploadImageToImgur = async (file: File): Promise<ImgurResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'file');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
                // Note: Do not set Content-Type header manually when using FormData,
                // the browser sets it automatically with the boundary.
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            const errorData = data as ImgurErrorResponse;
            throw new Error(errorData.data.error || `Upload failed with status ${response.status}`);
        }

        return data as ImgurResponse;
    } catch (error) {
        console.error('Imgur Upload Error:', error);
        throw error;
    }
};
