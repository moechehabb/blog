"use client";

import { useEffect, useRef, useState } from "react";

type Photo = { file: File; url: string };

export default function PhotoPicker() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        return () => photos.forEach(p => URL.revokeObjectURL(p.url));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function syncInput(next: Photo[]) {
        const dt = new DataTransfer();
        next.forEach(p => dt.items.add(p.file));
        if (inputRef.current) inputRef.current.files = dt.files;
    }

    function addFiles(list: FileList | null) {
        if (!list || list.length === 0) return;
        const added = Array.from(list).map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        const next = [...photos, ...added];
        setPhotos(next);
        syncInput(next);
    }

    function removePhoto(index: number) {
        URL.revokeObjectURL(photos[index].url);
        const next = photos.filter((_, i) => i !== index);
        setPhotos(next);
        syncInput(next);
    }

    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Add photos"
                className="flex h-24 w-24 cursor-pointer items-center justify-center border border-dashed border-zinc-900 text-2xl text-zinc-900 dark:border-white dark:text-white"
            >
                +
            </button>
            {photos.map((photo, index) => (
                <div key={photo.url} className="relative h-24 w-24">
                    <img
                        src={photo.url}
                        alt=""
                        className="h-full w-full border border-zinc-900 object-cover dark:border-zinc-700"
                    />
                    <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        aria-label="Remove photo"
                        className="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center bg-zinc-900 text-xs leading-none text-white dark:bg-white dark:text-black"
                    >
                        &times;
                    </button>
                </div>
            ))}
            <input
                ref={inputRef}
                type="file"
                name="photos"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                multiple
                className="hidden"
                onChange={e => addFiles(e.target.files)}
            />
        </div>
    );
}
