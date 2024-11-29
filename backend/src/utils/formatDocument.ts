export const formatDocument = (document: any): any => {
  if (!document) return null;

  // If `document` is a Mongoose document, call `toObject()`
  const baseDocument = typeof document.toObject === 'function' ? document.toObject() : document;

  // Ensure `_id` is converted to string
  const formattedId = baseDocument._id?.toString();

  // Handle the `image` field gracefully
  const formattedImage =
    baseDocument.image && Buffer.isBuffer(baseDocument.image)
      ? `data:image/webp;base64,${baseDocument.image.toString('base64')}`
      : baseDocument.image || null; // Retain the image if it's already a string or fallback to null

  return {
    ...baseDocument,
    id: formattedId,
    image: formattedImage,
  };
};
