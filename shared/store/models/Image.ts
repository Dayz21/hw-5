export type ImageResponseType = {
    id: number;
    documentId: string;
    name: string;
    width: number;
    height: number;
    url: string;
};

export type ImageType = {
    id: number;
    documentId: string;
    name: string;
    width: number;
    height: number;
    url: string;
};

export const toImageType = (response: ImageResponseType): ImageType => ({
    id: response.id,
    documentId: response.documentId,
    name: response.name,
    width: response.width,
    height: response.height,
    url: response.url,
});
