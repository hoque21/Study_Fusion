import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { consultantAPI, universityAPI } from "../../services/api";
import { resizeImage } from "../../utils/resizeImage";

const MySwal = withReactContent(Swal);

const CONTENT_TYPES = {
  consultants: {
    title: "Consultants",
    singular: "consultant",
    api: consultantAPI,
    fields: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "photo", label: "Consultant photo", type: "image" },
      { name: "section", label: "Department" },
      { name: "experience", label: "Experience" },
      { name: "available", label: "Availability" },
      { name: "address", label: "Office address" },
      { name: "tag", label: "Card label" },
      { name: "office", label: "Office name" },
      { name: "fee", label: "Consultation fee", type: "number", min: "0" },
    ],
  },
  universities: {
    title: "Universities",
    singular: "university",
    api: universityAPI,
    fields: [
      {
        name: "country",
        label: "Country",
        type: "select",
        options: ["Malaysia", "Australia"],
      },
      { name: "name", label: "University name" },
      { name: "type", label: "Institution type" },
      { name: "location", label: "Location" },
      { name: "tuition", label: "Indicative tuition" },
      { name: "image", label: "University photo", type: "image" },
      { name: "officialSite", label: "Official website URL", type: "url" },
      { name: "apply", label: "Application portal URL", type: "url" },
    ],
  },
};

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50";

const SiteContentManagement = ({ type }) => {
  const config = CONTENT_TYPES[type];
  const emptyForm = Object.fromEntries(
    config.fields.map((field) => [
      field.name,
      field.name === "country"
        ? field.options[0]
        : field.name === "fee"
          ? "50"
          : "",
    ]),
  );
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await config.api.getAll();
      setItems(response.data[type]);
    } catch (loadError) {
      setError(loadError.message || `Unable to load ${config.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [config, type]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setImageError("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setError("");
    setImageError("");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleImageChange = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const image = await resizeImage(file, 640);
      setForm((current) => ({ ...current, [fieldName]: image }));
    } catch (imageLoadError) {
      setImageError(imageLoadError.message);
      event.target.value = "";
    }
  };

  const isRequiredField = (field) =>
    type === "consultants"
      ? field.name === "name" || field.name === "role"
      : field.name !== "image" && field.name !== "officialSite";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId === null) {
        await config.api.create(form);
      } else {
        await config.api.update(editingId, form);
      }
      resetForm();
      await loadItems();
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
          saveError.message ||
          `Unable to save ${config.singular}.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const result = await MySwal.fire({
      title: `Delete ${config.singular}?`,
      text: `${item.name} will be removed from the public website.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#64748B",
    });
    if (!result.isConfirmed) return;

    try {
      await config.api.delete(item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch (deleteError) {
      MySwal.fire({
        title: `Could Not Delete ${config.singular}`,
        text:
          deleteError?.response?.data?.message ||
          deleteError.message ||
          "Please try again.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">{config.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, or remove {config.title.toLowerCase()} shown on the public website.
            Changes are saved in this browser.
          </p>
        </div>
        <span className="rounded-xl bg-[#FFF7E8] px-4 py-3 text-sm font-semibold text-[#7A4A12]">
          {items.length} {config.title.toLowerCase()}
        </span>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#0B1F3A]">
            {editingId === null ? `Add ${config.singular}` : `Edit ${config.singular}`}
          </h2>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-semibold text-[#3B5378] hover:underline"
            >
              Cancel editing
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {config.fields.map((field) => (
            <label
              className="block text-sm font-semibold text-gray-700"
              key={field.name}
            >
              {field.label}
              {isRequiredField(field) && (
                  <span className="ml-1 text-red-600" aria-hidden="true">
                    *
                  </span>
                )}
              {field.type === "image" ? (
                <>
                  <input
                    name={field.name}
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, field.name)}
                    className={inputClass}
                  />
                  <span className="mt-1 block text-xs font-normal text-gray-500">
                    Optional. Choose an image up to 5 MB; it will be resized for the site.
                  </span>
                  {form[field.name] && (
                    <img
                      src={form[field.name]}
                      alt={`${type === "consultants" ? "Consultant" : "University"} photo preview`}
                      className={`mt-2 h-20 w-32 object-cover ${
                        type === "consultants" ? "rounded-full" : "rounded-lg"
                      }`}
                    />
                  )}
                  {imageError && (
                    <span className="mt-1 block text-xs font-medium text-red-700" role="alert">
                      {imageError}
                    </span>
                  )}
                </>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name] || field.options[0]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  required={isRequiredField(field)}
                  className={inputClass}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type || "text"}
                  min={field.min}
                  value={form[field.name] ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  required={isRequiredField(field)}
                  className={inputClass}
                />
              )}
            </label>
          ))}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] px-6 py-3 font-bold text-[#0B1F3A] shadow hover:shadow-md disabled:opacity-60"
        >
          {editingId === null ? <FaPlus /> : <FaEdit />}
          {saving ? "Saving…" : editingId === null ? `Add ${config.singular}` : "Save changes"}
        </button>
      </form>

      {loading ? (
        <p className="rounded-xl bg-white p-8 text-center text-[#3B5378]" role="status">
          Loading {config.title.toLowerCase()}…
        </p>
      ) : error && items.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center">
          <p className="text-red-700" role="alert">{error}</p>
          <button
            type="button"
            onClick={loadItems}
            className="mt-3 text-sm font-semibold text-[#0B1F3A] underline"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500">
          No {config.title.toLowerCase()} found.
        </p>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {type === "consultants" && (
                    <img
                      src={item.photo || "/student-avatar.svg"}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                  )}
                  {type === "universities" && item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#0B1F3A]">{item.name}</h3>
                    <p className="text-sm text-[#3B5378]">
                      {type === "consultants"
                        ? `${item.role} · ${item.section}`
                        : `${item.country} · ${item.type} · ${item.location}`}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {type === "consultants"
                        ? `${item.experience} · ${item.available} · $${item.fee}`
                        : item.tuition}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-gray-50"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SiteContentManagement;
