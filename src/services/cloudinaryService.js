/**
 * @fileoverview Servicio de Cloudinary
 * Maneja la subida de imágenes al servidor de Cloudinary.
 * Las imágenes se suben directamente desde el navegador sin pasar por un backend.
 *
 * @example
 * const url = await cloudinaryService.uploadImage(file);
 * // url = "https://res.cloudinary.com/dpnbgtieq/image/upload/..."
 */

/** Configuración de Cloudinary */
const CLOUDINARY_CLOUD_NAME  = "dpnbgtieq";
const CLOUDINARY_UPLOAD_PRESET = "Pandea";

/**
 * Servicio para subir imágenes a Cloudinary.
 */
export const cloudinaryService = {
  /**
   * Sube una imagen a Cloudinary y devuelve la URL pública.
   * Usa un upload preset "unsigned" para no exponer el API Secret.
   *
   * @param {File} file - Archivo de imagen seleccionado por el usuario
   * @returns {Promise<string>} URL pública de la imagen subida
   * @throws {Error} Si la subida falla
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file",         file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder",       "pandea-productos");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Error al subir la imagen.");

    const data = await response.json();
    return data.secure_url;
  }
};
