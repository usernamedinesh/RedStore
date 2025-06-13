// ModalForm.jsx
import { createPortal } from "react-dom";
import { useState } from "react";
import axios from "axios";
import { useAppContext } from "./context";

import ImageUploading from "react-images-uploading";

export default function ModalForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { data } = useAppContext();
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
        images: [],
      },
    ],
  });

  // Update top-level product fields
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    // setProduct({ ...product, [name]: value });
    setProduct((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async () => {
    setLoading(true);
    // i need to append all the data to formData
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("categoryName", product.categoryName);
    formData.append("brandName", product.brandName);
    formData.append("gender", product.gender || "UNISEX");
    // formData.append("basePrice", product.basePrice || "");
    formData.append("basePrice", String(Number(product.basePrice || 0)));

    product.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][color]`, variant.color);
      formData.append(`variants[${index}][stock]`, variant.stock);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][sku]`, variant.sku);

      variant.images.forEach((image, imgIndex) => {
        if (image && image.file) {
          formData.append(`variants[${index}][images]`, image.file);
        }
      });
    });

    const response = await axios.post(
      `http://localhost:3000/admin/product/${data.id}`,
      formData,
    );
    setLoading(false);
    console.log("response ", response.data);
    console.log("response ", response.data.data);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-full overflow-auto h-screen">
      <div className="bg-white text-black p-6 rounded-lg w-full  mx-auto shadow-lg w-full max-w-3xl overflow-auto h-screen">
        <h2 className="text-xl font-bold mb-4">Create Product</h2>
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="loader">loading</div>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // handle submit
            console.log("Submitted");
          }}
          className="h-full w-full"
        >
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Product Name"
              onChange={handleProductChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="description"
              placeholder="Description"
              onChange={handleProductChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="categoryName"
              placeholder="Category Name"
              onChange={handleProductChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="brandName"
              placeholder="Brand"
              onChange={handleProductChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="gender"
              onChange={handleProductChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
              <option value="UNISEX">Unisex</option>
            </select>
            <input
              name="basePrice"
              type="number"
              placeholder="Base Price"
              onChange={handleProductChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <h3 className="text-lg font-semibold">Variants</h3>
          {product.variants.map((variant, index) => (
            <div
              key={index}
              className="border px-4 rounded space-y-2 bg-gray-100 py-2"
            >
              <input
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(index, "size", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Stock"
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(index, "stock", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Price"
                type="number"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) =>
                  handleVariantChange(index, "sku", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onClick={handleSubmit}
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
