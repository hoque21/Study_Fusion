import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaStar, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { reviewAPI } from "../../services/api";

const MySwal = withReactContent(Swal);

const EMPTY_FORM = {
  name: "",
  university: "",
  course: "",
  comment: "",
  rating: 5,
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await reviewAPI.getAll();
      setReviews(response.data.reviews);
    } catch (loadError) {
      setError(
        loadError.message ||
          "Unable to load reviews. Check browser storage and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reviews;
    return reviews.filter((review) =>
      [review.name, review.university, review.course, review.comment]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [reviews, search]);

  const startAdd = () => {
    setEditingReview(null);
    setForm(EMPTY_FORM);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setForm({
      name: review.name,
      university: review.university,
      course: review.course,
      comment: review.comment,
      rating: review.rating,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingReview) {
        const response = await reviewAPI.update(editingReview.id, form);
        setReviews((current) =>
          current.map((review) =>
            review.id === editingReview.id ? response.data.review : review,
          ),
        );
      } else {
        const response = await reviewAPI.create(form);
        setReviews((current) => [response.data.review, ...current]);
      }
      setEditingReview(null);
      setForm(EMPTY_FORM);
      await MySwal.fire({
        title: editingReview ? "Review Updated" : "Review Added",
        text: "The student review has been saved.",
        icon: "success",
        iconColor: "#F5A623",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    } catch (saveError) {
      MySwal.fire({
        title: "Could Not Save Review",
        text:
          saveError?.response?.data?.message ||
          saveError.message ||
          "Please check the review details and try again.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (review) => {
    const result = await MySwal.fire({
      title: "Delete this review?",
      text: `This will remove ${review.name}'s review from the home page.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Review",
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#64748B",
    });
    if (!result.isConfirmed) return;

    try {
      await reviewAPI.delete(review.id);
      setReviews((current) =>
        current.filter((item) => item.id !== review.id),
      );
      if (editingReview?.id === review.id) startAdd();
    } catch (deleteError) {
      MySwal.fire({
        title: "Could Not Delete Review",
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
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Student Reviews
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add, edit, and remove the reviews displayed on the home page.
            Changes are saved in this browser.
          </p>
        </div>
        <div className="rounded-xl bg-[#FFF7E8] px-4 py-3 text-sm font-semibold text-[#7A4A12]">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#0B1F3A]">
            {editingReview ? "Edit Review" : "Add a Student Review"}
          </h2>
          {editingReview && (
            <button
              type="button"
              onClick={startAdd}
              className="text-sm font-semibold text-[#3B5378] hover:underline"
            >
              Cancel editing
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm font-semibold text-gray-700">
            Student name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={80}
              className={`${inputClass} mt-1 font-normal`}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            University
            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              required
              maxLength={120}
              className={`${inputClass} mt-1 font-normal`}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Course
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              required
              maxLength={120}
              className={`${inputClass} mt-1 font-normal`}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Rating
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className={`${inputClass} mt-1 font-normal`}
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} {rating === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-semibold text-gray-700">
          Student comment
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            required
            maxLength={1000}
            rows={4}
            className={`${inputClass} mt-1 font-normal resize-y`}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] px-6 py-3 font-bold text-[#0B1F3A] shadow hover:shadow-md disabled:opacity-60"
        >
          {editingReview ? <FaEdit /> : <FaPlus />}
          {saving
            ? "Saving..."
            : editingReview
              ? "Save Changes"
              : "Add Review"}
        </button>
      </form>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <label className="relative block">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reviews by student, university, course, or comment"
              className={`${inputClass} pl-10`}
            />
          </label>
        </div>

        {loading ? (
          <p className="p-8 text-center text-[#3B5378]">Loading reviews...</p>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadReviews}
              className="mt-3 text-sm font-semibold text-[#0B1F3A] underline"
            >
              Try again
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            {reviews.length
              ? "No reviews match your search."
              : "No student reviews yet. Add one using the form above."}
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredReviews.map((review) => (
              <article
                key={review.id}
                className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-bold text-[#0B1F3A]">{review.name}</h3>
                    <span
                      className="flex items-center gap-1 text-[#F5A623]"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }, (_, index) => (
                        <FaStar key={index} size={12} />
                      ))}
                    </span>
                  </div>
                  <p className="text-sm text-[#3B5378] mt-1">
                    {review.university} · {review.course}
                  </p>
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap break-words">
                    {review.comment}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-gray-50"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
