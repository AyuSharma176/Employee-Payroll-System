import fs from 'fs/promises';

export const readFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        throw error;
    }  
};

export const writeFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath,data);
        console.log('File written successfully');
    } catch (error) {
        console.error(`Error writing file: ${error}`);
        throw error;
    }
};
