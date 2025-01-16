'use server';
import path from 'path';
import fs from 'fs';
import { updateCurrentUser } from '@/lib/dal/user.dal';
import { UpdateUser } from '@/lib/models/user.interface';

interface UploadResult {
    success: boolean;
    fileName?: string;
    filePath?: string;
    error?: string;
}

interface BrowserFile {
    name: string;
    type: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
}

/**
 * Uploads an image to a specific directory.
 * @param file - The file to upload, either a browser `File` or an object mimicking `Express.Multer.File`.
 * @returns A promise with the upload result.
 */
export const uploadImage = async (file: BrowserFile): Promise<UploadResult> => {
    if (!file) {
        return { success: false, error: 'No file provided' };
    }

    if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Only image files are allowed' };
    }

    try {
        const uploadPath = path.join(__dirname, '../../../../public/pfImages');
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadPath, fileName);

        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Convert the file to a Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Write the file to the upload directory
        fs.writeFileSync(filePath, buffer);

        return {
            success: true,
            fileName,
            filePath
        };
    } catch (err) {
        return { success: false, error: `File upload failed: ${(err as Error).message}` };
    }
};
