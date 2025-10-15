import domtoimage from "dom-to-image";
import { useCallback } from "react";

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
export function useDomToImage() {
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
   * Set Twitter Card meta tags
   * @param title Card title
   * @param description Card description
   * @param image Card image URL
   * @param url Card URL
   * @param cardType Card type
   * @param site Twitter site handle
   * @param creator Twitter creator handle
   */
  const setTwitterCard = useCallback(
    (
      title: string,
      description: string,
      image: string,
      url?: string,
      cardType:
        | "summary"
        | "summary_large_image"
        | "app"
        | "player" = "summary_large_image",
      site?: string,
      creator?: string
    ) => {
      const setMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(
          `meta[name="${name}"]`
        ) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      // Set Twitter Card properties
      setMetaTag("twitter:card", cardType);
      setMetaTag("twitter:title", title);
      setMetaTag("twitter:description", description);
      setMetaTag("twitter:image", image);

      if (url) {
        setMetaTag("twitter:url", url);
      }

      if (site) {
        setMetaTag("twitter:site", site);
      }

      if (creator) {
        setMetaTag("twitter:creator", creator);
      }

      // Also set Open Graph tags for better compatibility
      setMetaTag("og:title", title);
      setMetaTag("og:description", description);
      setMetaTag("og:image", image);
      setMetaTag("og:type", "website");

      if (url) {
        setMetaTag("og:url", url);
      }
    },
    []
  );

  /**
   * Share image via Twitter with Twitter Card
   * @param dataUrl Base64 image data
   * @param options Share options
   */
  const shareImage = useCallback(
    async (dataUrl: string, options: ShareOptions = {}) => {
      const {
        text = "Check out this image",
        url,
        hashtags = ["Dolla", "Crypto", "Trading", "Bitcoin"],
        via,
        title,
        imageUrl
      } = options;

      try {
        // Set Twitter Card meta tags if title and imageUrl are provided
        if (title && imageUrl) {
          setTwitterCard(
            title,
            text,
            imageUrl,
            url,
            "summary_large_image",
            via ? `@${via}` : undefined,
            via ? `@${via}` : undefined
          );
        }

        // First download the image to get the file
        const filename = `shared-image-${Date.now()}`;
        downloadImage(dataUrl, filename);

        // Create hashtags string
        const hashtagsString = hashtags.map((tag) => `#${tag}`).join(" ");

        // Create Twitter share URL with enhanced parameters
        const twitterText = encodeURIComponent(`${text}\n\n${hashtagsString}`);
        const twitterUrl = url ? encodeURIComponent(url) : "";
        const viaParam = via ? `&via=${encodeURIComponent(via)}` : "";

        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${twitterText}${
          twitterUrl ? `&url=${twitterUrl}` : ""
        }${viaParam}`;

        // Open Twitter in new window
        window.open(twitterShareUrl, "_blank", "width=600,height=400");
      } catch (error) {
        console.error("Failed to share image:", error);
        // Fallback to download only
        downloadImage(dataUrl, "shared-image");
        throw new Error("Failed to share image, downloaded instead");
      }
    },
    [downloadImage, setTwitterCard]
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
      try {
        const dataUrl = await generateImage(node, options);
        downloadImage(dataUrl, filename);
        return dataUrl;
      } catch (error) {
        console.error("Failed to generate and download image:", error);
        throw error;
      }
    },
    [generateImage, downloadImage]
  );

  /**
   * Generate and share image in one step
   * @param node DOM node or selector
   * @param options Generation options
   * @param shareOptions Share options
   */
  const generateAndShare = useCallback(
    async (
      node: HTMLElement | string,
      options: ImageGenerationOptions = {},
      shareOptions: ShareOptions = {}
    ) => {
      try {
        const dataUrl = await generateImage(node, options);
        await shareImage(dataUrl, shareOptions);
        return dataUrl;
      } catch (error) {
        console.error("Failed to generate and share image:", error);
        throw error;
      }
    },
    [generateImage, shareImage]
  );

  return {
    generateImage,
    downloadImage,
    shareImage,
    generateAndDownload,
    generateAndShare,
    setTwitterCard
  };
}
