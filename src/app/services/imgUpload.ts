'use server';
import path from 'path';
import fs from 'fs';

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

export const uploadImage = async (img: BrowserFile): Promise<UploadResult> => {
	if (!img) {
		return { success: false, error: 'No file provided' };
	}

	if (!img.type.startsWith('image/')) {
		return { success: false, error: 'Only image files are allowed' };
	}

	try {
		const uploadPath = path.join(__dirname, '../../../../public/pfImages');
		const fileName = `${Date.now()}-${img.name}`;
		const filePath = path.join(uploadPath, fileName);

		// Ensure the directory exists
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		// Convert the file to a Buffer
		const buffer = Buffer.from(await img.arrayBuffer());

		// Write the file to the upload directory
		fs.writeFileSync(filePath, buffer);

		return {
			success: true,
			fileName,
			filePath,
		};
	} catch (err) {
		return {
			success: false,
			error: `Image upload failed: ${(err as Error).message}`,
		};
	}
};

export const deleteImage = async (
	fileName: string
): Promise<{ success: boolean; message: string }> => {
	return new Promise((resolve, reject) => {
		// Define the directory where images are stored
		const uploadPath = path.join(__dirname, '../../../../public/pfImages');

		// Construct the full file path
		const filePath = path.join(uploadPath, fileName);

		// Check if the file exists
		fs.access(filePath, (accessErr) => {
			if (accessErr) {
				if (accessErr.code === 'ENOENT') {
					return resolve({
						success: false,
						message: `File ${fileName} not found.`,
					});
				}
				return reject(accessErr);
			}

			// If the file exists, delete it
			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) {
					return reject(unlinkErr);
				}

				return resolve({
					success: true,
					message: `File ${fileName} has been successfully deleted.`,
				});
			});
		});
	});
};
