export const formatDocument = (document: any): any => {
  if (!document) return null;

  return {
    ...document.toObject(),
    id: document._id.toString(),
    image: document.image
      ? `data:image/webp;base64,${Buffer.isBuffer(document.image) ? document.image.toString('base64') : document.image}`
      : null,
  };
};
