import React, {useEffect, useId, useState} from 'react';
import './fileInput.scss';
import {cropImageToCircle} from "../../../functions/cropToCircle.ts";

interface FileInputParams {
    label: string;
    allowedTypes: string[]; //MIME types such as ['image/png', 'image/jpeg', 'image/webp']
    value: File | null;
    setValue: React.Dispatch<React.SetStateAction<File | null>>;
    id?: string;
    enforceCircle?: boolean;
}

export default function FileInput({label, allowedTypes, value, setValue, id, enforceCircle}: FileInputParams): React.ReactElement {

    const generatedId = useId();
    const inputId = id ?? generatedId;

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    //builds the image url
    useEffect(() => {
        if (!value || !value.type.startsWith('image/')) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(value);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [value]);

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = e.target.files?.[0] ?? null;
        setError(null);

        if (file && !allowedTypes.includes(file.type)) {
            setError(`File type not allowed. Accepted types: ${allowedTypes.join(', ')}`);
            setValue(null);
            e.target.value = '';
            return;
        }

        //might need to crop to circle
        if (file && enforceCircle && file.type.startsWith("image/")) {
            try {
                setValue(await cropImageToCircle(file));
            }
            catch {
                setError("Failed to process image, please try a different file");
                setValue(null);
                e.target.value = '';

            }
            return;
        }

        setValue(file);
    }

    return (
        <div className={`formGroup, fileInputWrapper ${enforceCircle ? "fileInputCircular" : ""}`}>
            <label htmlFor={inputId} style={{marginBottom: '7px'}}>
                {label}
            </label>

            <input
                id={inputId}
                type={"file"}
                accept={allowedTypes.join(',')}
                onChange={handleChange}
            />

            {previewUrl && (
                <img
                    src={previewUrl}
                    alt={"File preview"}
                    className={`fileInputPreview ${enforceCircle ? "circular" : ""}`}
                />
            )}

            {!previewUrl && value && (
                <p className={"fileInputFallback"}>{value.name}</p>
            )}

            {error && <p className={"errorText"}>{error}</p>}
        </div>
    )
}