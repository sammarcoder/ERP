"use client";
import { api } from "../../../lib/api";

export default function Form() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Force conversion to strings
    const data = {
      name: String(formData.get("name") || ""),
      type1: String(formData.get("type1") || ""),
      type2: String(formData.get("type2") || ""),
      classification: String(formData.get("classification") || "")
    };

    console.log("Sending data:", data);

    try {
      const res = await api(data); // Now it's a clean JSON object
    //   console.log("Response:", res.data);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl flex justify-center space-y-4">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" required className="border" />
        </div>
        <div>
          <label>Type1:</label>
          <input type="text" name="type1" required className="border" />
        </div>
        <div>
          <label>Type2:</label>
          <input type="text" name="type2" required className="border" />
        </div>
        <div>
          <label>Classification:</label>
          <textarea name="classification" required className="border"></textarea>
        </div>
        <div>
          <button type="submit" className="bg-black text-white p-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
