// Simple image file to base64 converter for local file uploads
class ImageUploadHelper {
    static convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    static async handleImageUpload(inputElement) {
        if (inputElement.files && inputElement.files[0]) {
            try {
                const base64Image = await this.convertToBase64(inputElement.files[0]);
                return base64Image;
            } catch (error) {
                console.error('Error converting image:', error);
                return null;
            }
        }
        return null;
    }
}