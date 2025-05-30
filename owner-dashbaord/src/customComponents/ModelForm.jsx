// ModalForm.jsx
import { createPortal } from "react-dom";
import { useState } from "react";

import ImageUploading from "react-images-uploading";

export default function ModalForm({ onClose }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    categoryName: "",
    brandName: "",
    gender: "",
    basePrice: "",
    variants: [
      {
        size: "",
        color: "",
        stock: "",
        price: "",
        sku: "",
        images: [""],
      },
    ],
  });

  // Update top-level product fields
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Update variant fields
  // const handleVariantChange = (index, field, value) => {
  //   const newVariants = [...product.variants];
  //   newVariants[index][field] = value;
  //   setProduct({ ...product, variants: newVariants });
  // };

  // Update images in variant
  const handleImageChange = (index, fileList) => {
    const filesArray = Array.from(fileList); // Convert FileList to array
    const newVariants = [...product.variants];
    newVariants[index].images = filesArray;
    setProduct({ ...product, variants: newVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: "", color: "", stock: "", price: "", sku: "", images: [""] },
      ],
    });
  };

  const removeVariant = (index) => {
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: newVariants });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", product);

    // Add validation if needed
    // Send to API
    // fetch('/api/product', { ... })
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md mx-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // handle submit
            console.log("Submitted");
          }}
        >
          <input
            name="name"
            placeholder="Product Name"
            onChange={handleProductChange}
          />
          <input
            name="description"
            placeholder="Description"
            onChange={handleProductChange}
          />
          <input
            name="categoryName"
            placeholder="Category Name"
            onChange={handleProductChange}
          />
          <input
            name="brandName"
            placeholder="Brand"
            onChange={handleProductChange}
          />
          <input
            name="gender"
            placeholder="Gender"
            onChange={handleProductChange}
          />
          <input
            name="basePrice"
            type="number"
            placeholder="Base Price"
            onChange={handleProductChange}
          />
          <h3 className="text-lg font-semibold">Variants</h3>
          {product.variants.map((variant, index) => (
            <div
              key={index}
              className="border p-4 rounded space-y-2 bg-gray-100"
            >
              <input
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(index, "size", e.target.value)
                }
              />
              <input
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
              />
              <input
                placeholder="Stock"
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(index, "stock", e.target.value)
                }
              />
              <input
                placeholder="Price"
                type="number"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
              />
              <input
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) =>
                  handleVariantChange(index, "sku", e.target.value)
                }
              />
              <ImageUploading
                multiple
                value={variant.images}
                onChange={(newImages) =>
                  handleVariantChange(index, "images", newImages)
                }
                maxNumber={5}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="mt-4">
                    {/* Upload Buttons */}
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded text-white transition ${
                          isDragging
                            ? "bg-red-500"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Click or Drop Images
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 text-black"
                        onClick={onImageRemoveAll}
                      >
                        Remove All
                      </button>
                      <span className="text-sm text-gray-600">
                        {imageList.length} image
                        {imageList.length !== 1 ? "s" : ""} selected
                      </span>
                    </div>

                    {/* Preview Thumbnails */}
                    <div className="flex flex-wrap gap-4">
                      {imageList.map((image, i) => (
                        <div
                          key={i}
                          className="relative border rounded p-2 bg-white shadow"
                        >
                          <img
                            src={image.data_url}
                            alt={`preview-${i}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <div className="flex justify-between text-xs mt-2">
                            <button
                              type="button"
                              className="text-blue-600 hover:underline"
                              onClick={() => onImageUpdate(i)}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="text-red-500 hover:underline"
                              onClick={() => onImageRemove(i)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 underline"
              >
                Remove Variant
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="bg-green-500 text-white px-3 py-1 rounded mt-2 text-center"
          >
            + Add Variant
          </button>

          <div className="flex justify-between ">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2 "
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-red-600 underline"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal-root"),
  );
}
