import domtoimage from "dom-to-image";
import { useCallback, useState } from "react";
import useUpload from "@/hooks/use-upload";
import axiosInstance from "@/libs/axios";

// Helper function to convert dataURL to Blob (CSP-safe method)
function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "png" | "jpeg" | "webp";
  backgroundColor?: string;
  pixelRatio?: number;
}

export interface ShareOptions {
  title?: string;
  description?: string;
  text?: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  via?: string;
}

/**
 * Hook for generating images from DOM nodes
 * Supports download and share functionality
 */
export function useShare() {
  const { uploadFile } = useUpload();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  /**
   * Convert DOM node to image
   * @param node DOM node or selector
   * @param options Generation options
   * @returns Promise<string> Returns base64 image data
   */
  const generateImage = useCallback(
    async (
      node: HTMLElement | string,
      options: ImageGenerationOptions = {}
    ): Promise<string> => {
      const {
        width,
        height,
        quality = 3,
        backgroundColor = "#ffffff",
        pixelRatio = 2
      } = options;

      const targetNode =
        typeof node === "string"
          ? (document.querySelector(node) as HTMLElement)
          : node;

      if (!targetNode) {
        throw new Error("Target DOM node not found");
      }

      const config = {
        quality,
        bgcolor: backgroundColor,
        pixelRatio,
        width,
        height
      };

      try {
        const dataUrl = await domtoimage.toPng(targetNode, config);

        return dataUrl;
      } catch (error) {
        console.error("Failed to generate image:", error);
        throw new Error("Failed to generate image from DOM node");
      }
    },
    []
  );

  /**
   * Download image
   * @param dataUrl Base64 image data
   * @param filename Filename (without extension)
   */
  const downloadImage = useCallback(
    (dataUrl: string, filename: string = "image") => {
      try {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to download image:", error);
        throw new Error("Failed to download image");
      }
    },
    []
  );

  /**
   * Share image via Twitter with Twitter Card
   * @param options Share options
   */
  const shareImage = useCallback(
    async (options: ShareOptions = {}) => {
      const { title, description, imageUrl } = options;

      try {
        const res = await axiosInstance.post("/api/v1/share/create", {
          title,
          description,
          image: imageUrl
        });
        const url = res.data.data.share_url;

        const twitterText = encodeURIComponent(`${title}\n${description}`);

        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${url}`;
        // Open Twitter in new window
        window.open(twitterShareUrl, "_blank");
      } catch (error) {
        console.error("Failed to share image:", error);
        // Fallback to download only
        // downloadImage(dataUrl, "shared-image");
        throw new Error("Failed to share image, downloaded instead");
      }
    },
    [downloadImage]
  );

  /**
   * Generate and download image in one step
   * @param node DOM node or selector
   * @param filename Filename
   * @param options Generation options
   */
  const generateAndDownload = useCallback(
    async (
      node: HTMLElement | string,
      filename: string = "image",
      options: ImageGenerationOptions = {}
    ) => {
      setDownloading(true);
      try {
        const dataUrl = await generateImage(node, options);
        downloadImage(dataUrl, filename);
        return dataUrl;
      } catch (error) {
        console.error("Failed to generate and download image:", error);
        throw error;
      } finally {
        setDownloading(false);
      }
    },
    [generateImage, downloadImage]
  );

  /**
   * Generate and share image in one step
   * @param node DOM node or selector
   * @param options Generation options
   * @param shareOptions Share options
   * @param uploadFile Upload function from useUpload hook
   */
  const generateAndShare = useCallback(
    async (
      node: HTMLElement | string,
      options: ImageGenerationOptions = {},
      shareOptions: ShareOptions = {}
    ) => {
      setSharing(true);
      try {
        // Generate image from DOM node
        const dataUrl = await generateImage(node, {
          format: "png",
          quality: 1,
          pixelRatio: 1,
          ...options
        });

        // Use CSP-safe method to convert dataURL to Blob
        // This avoids CSP issues with data: protocol
        const blob = dataURLtoBlob(dataUrl);

        const imageUrl = await uploadFile({
          dir: "share",
          file: blob
        });

        // downloadImage(dataUrl, "share-image");

        // return;

        if (!imageUrl) return;

        // Share with uploaded image URL
        await shareImage({
          ...shareOptions,
          imageUrl
        });
      } catch (error) {
        console.error("Failed to generate and share image:", error);
        throw error;
      } finally {
        setSharing(false);
      }
    },
    [generateImage, shareImage]
  );

  return {
    downloading,
    sharing,
    generateImage,
    downloadImage,
    shareImage,
    generateAndDownload,
    generateAndShare
  };
}
