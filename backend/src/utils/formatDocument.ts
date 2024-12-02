export const formatDocument = (document: any): any => {
  if (!document) return null;

  const doc = typeof document.toObject === 'function' ? document.toObject() : document;

  return {
    ...doc,
    id: (doc._id || document._id).toString(),
    image: doc.image
      ? `data:image/webp;base64,${Buffer.isBuffer(doc.image) ? doc.image.toString('base64') : doc.image}`
      : null,
  };
};
