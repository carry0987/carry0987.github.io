export interface ImgurImage {
    id: string;
    title: string | null;
    description: string | null;
    datetime: number;
    type: string;
    animated: boolean;
    width: number;
    height: number;
    size: number;
    views: number;
    bandwidth: number;
    deletehash?: string;
    name?: string;
    link: string;
}

export interface ImgurResponse {
    data: ImgurImage;
    success: boolean;
    status: number;
}

export interface ImgurErrorResponse {
    data: {
        error: string;
        request: string;
        method: string;
    };
    success: boolean;
    status: number;
}

export interface UploadedItem extends ImgurImage {
    localId: string; // Internal ID for UI tracking
    timestamp: number;
}
