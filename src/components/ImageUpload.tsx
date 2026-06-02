"use client";

import { useState, useCallback, useId } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | undefined) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState("");
  const inputId = useId();

  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "上传失败");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange(undefined);
  }, [onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-text-secondary">菜品图片</label>

      {preview ? (
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-base border border-border-subtle">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
            "border-border-subtle hover:border-accent/30 bg-bg-base",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
              <p className="text-sm text-text-muted">上传中...</p>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-text-muted" />
              <p className="text-sm text-text-muted">点击或拖拽上传图片</p>
              <p className="text-xs text-text-muted">支持 JPG、PNG、WebP，最大 5MB</p>
            </>
          )}
        </label>
      )}

      {error && <p className="text-danger text-xs">{error}</p>}

      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
