import { useState } from 'react';
import { imageService } from '../services/imageService';

function ImageUpload({ patientId, onImageUploaded }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [error, setError] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Skapa preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Välj en fil först');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const result = await imageService.uploadImage(selectedFile);
            setUploadedImage(result);

            if (onImageUploaded) {
                onImageUploaded(result);
            }

            // Rensa efter lyckad uppladdning
            setSelectedFile(null);
            setPreview(null);
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Uppladdningen misslyckades. Kontrollera att image-service är igång.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="white-box">
            <h3>Ladda upp bild</h3>

            <div className="form-group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>

            {preview && (
                <div style={{ marginBottom: '12px' }}>
                    <p>Förhandsvisning:</p>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ccc' }}
                    />
                </div>
            )}

            {error && <p className="error">{error}</p>}

            <button onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? 'Laddar upp...' : 'Ladda upp'}
            </button>

            {uploadedImage && (
                <div style={{ marginTop: '12px' }}>
                    <p style={{ color: 'green' }}>✓ Bild uppladdad!</p>
                    <p>Filnamn: {uploadedImage.filename}</p>
                    <img
                        src={imageService.getImageUrl(uploadedImage.filename)}
                        alt="Uploaded"
                        style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ccc' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUpload;