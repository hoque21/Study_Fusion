import { INITIAL_CONSULTANTS, INITIAL_UNIVERSITIES } from "../data/siteContent";

const STORAGE_KEY = "studyfusion_demo_data_v1";

const emptyStore = () => ({
  users: [],
  messages: [],
  appointments: [],
  reviews: [],
  passwordResets: [],
  consultants: INITIAL_CONSULTANTS.map((consultant, index) => ({
    ...consultant,
    id: index + 1,
  })),
  universities: INITIAL_UNIVERSITIES.map((university, index) => ({
    ...university,
    id: index + 1,
  })),
});

const readStore = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return emptyStore();

  let store;
  try {
    store = JSON.parse(saved);
  } catch {
    throw new Error(
      "Saved demo data is invalid. Clear this site's local storage to start over.",
    );
  }

  if (!store || typeof store !== "object" || Array.isArray(store)) {
    throw new Error(
      "Saved demo data is invalid. Clear this site's local storage to start over.",
    );
  }

  const collections = [
    "users",
    "messages",
    "appointments",
    "reviews",
    "passwordResets",
    "consultants",
    "universities",
  ];
  if (
    collections.some(
      (collection) =>
        store[collection] !== undefined && !Array.isArray(store[collection]),
    )
  ) {
    throw new Error(
      "Saved demo data is invalid. Clear this site's local storage to start over.",
    );
  }

  const mergedStore = { ...emptyStore(), ...store };
  mergedStore.reviews = mergedStore.reviews.map((review) => ({
    status: "approved",
    ...review,
  }));
  return mergedStore;
};

const writeStore = (store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const respond = (data) => ({ data });

const createError = (message, status = 400) => {
  const error = new Error(message);
  error.response = { data: { message }, status };
  return error;
};

const nextId = (items) =>
  items.reduce((largest, item) => Math.max(largest, Number(item.id) || 0), 0) +
  1;

const getCurrentUser = () => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
    throw new Error(
      "Saved demo profile is invalid. Sign out and sign in again.",
    );
  }
};

const safeUser = (user) => {
  const sanitizedUser = { ...user };
  delete sanitizedUser.password;
  delete sanitizedUser.confirmPassword;
  return sanitizedUser;
};

const normalizeRegistration = (data) => {
  if (data instanceof FormData) {
    return Object.fromEntries(
      [...data.entries()].map(([key, value]) => [
        key,
        typeof File !== "undefined" && value instanceof File
          ? { name: value.name, type: value.type, size: value.size }
          : value,
      ]),
    );
  }
  return { ...data };
};

const requireCurrentUser = () => {
  const user = getCurrentUser();
  if (!user) throw createError("Please sign in to continue.", 401);
  return user;
};

export const authAPI = {
  register: async (input) => {
    const data = normalizeRegistration(input);
    const mobile = String(data.mobile || "").trim();
    const password = String(data.password || "");
    if (!mobile || !password) {
      throw createError("Mobile number and password are required.");
    }

    const store = readStore();
    if (store.users.some((user) => user.mobile === mobile)) {
      throw createError("An account with this mobile number already exists.", 409);
    }

    const profileData = { ...data };
    delete profileData.confirmPassword;
    const user = {
      ...profileData,
      id: nextId(store.users),
      mobile,
      name: String(data.name || "").trim(),
      created_at: new Date().toISOString(),
      is_active: 1,
    };
    store.users.push(user);
    writeStore(store);
    return respond({ user: safeUser(user) });
  },

  login: async ({ mobile, password }) => {
    const store = readStore();
    const user = store.users.find(
      (item) =>
        item.mobile === String(mobile || "").trim() &&
        item.password === password,
    );
    if (!user || !user.is_active) {
      throw createError("Invalid mobile number or password.", 401);
    }

    const token = `demo-${user.id}-${Date.now()}`;
    const userData = safeUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    return respond({ token, user: userData });
  },

  getProfile: async () => {
    const user = requireCurrentUser();
    return respond({ user });
  },

  updateProfile: async (data) => {
    const currentUser = requireCurrentUser();
    const store = readStore();
    const user = store.users.find((item) => item.id === currentUser.id);
    if (!user) throw createError("Account not found.", 404);

    Object.assign(user, data);
    const userData = safeUser(user);
    writeStore(store);
    localStorage.setItem("user", JSON.stringify(userData));
    return respond({ user: userData });
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const currentUser = requireCurrentUser();
    const store = readStore();
    const user = store.users.find((item) => item.id === currentUser.id);
    if (!user || user.password !== currentPassword) {
      throw createError("Current password is incorrect.", 401);
    }
    user.password = newPassword;
    writeStore(store);
    return respond({ message: "Password updated." });
  },

  forgotPassword: async ({ mobile }) => {
    const store = readStore();
    const user = store.users.find(
      (item) => item.mobile === String(mobile || "").trim(),
    );
    if (!user) throw createError("No account found for that mobile number.", 404);

    const resetToken = `reset-${user.id}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    store.passwordResets = store.passwordResets.filter(
      (item) => item.userId !== user.id,
    );
    store.passwordResets.push({
      token: resetToken,
      userId: user.id,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });
    writeStore(store);
    return respond({
      message: "Use the local demo reset link shown below to choose a new password.",
      resetToken,
    });
  },

  resetPassword: async ({ token, newPassword }) => {
    const store = readStore();
    const reset = store.passwordResets.find(
      (item) => item.token === token && item.expiresAt > Date.now(),
    );
    if (!reset) throw createError("The reset link is invalid or has expired.", 400);

    const user = store.users.find((item) => item.id === reset.userId);
    if (!user) throw createError("Account not found.", 404);
    user.password = newPassword;
    store.passwordResets = store.passwordResets.filter(
      (item) => item.token !== token,
    );
    writeStore(store);
    return respond({ message: "Your password has been updated successfully." });
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return respond({ message: "Signed out." });
  },
};

export const userAPI = {
  getProfile: authAPI.getProfile,
  updateProfile: authAPI.updateProfile,
  changePassword: authAPI.changePassword,
};

export const contactAPI = {
  submit: async (data) => {
    const store = readStore();
    const message = {
      ...data,
      id: nextId(store.messages),
      status: "New",
      created_at: new Date().toISOString(),
    };
    store.messages.unshift(message);
    writeStore(store);
    return respond({ message: "Your message has been saved in this browser." });
  },

  getMessages: async () => respond({ messages: readStore().messages }),

  updateStatus: async (id, status) => {
    const store = readStore();
    const message = store.messages.find((item) => item.id === Number(id));
    if (!message) throw createError("Message not found.", 404);
    message.status = status;
    writeStore(store);
    return respond({ message });
  },

  deleteMessage: async (id) => {
    const store = readStore();
    store.messages = store.messages.filter((item) => item.id !== Number(id));
    writeStore(store);
    return respond({ message: "Message deleted." });
  },
};

export const reviewAPI = {
  getAll: async () => respond({ reviews: [...readStore().reviews].reverse() }),

  getPublic: async () =>
    respond({
      reviews: [...readStore().reviews]
        .filter((review) => review.status === "approved")
        .reverse(),
    }),

  create: async (data, status = "approved") => {
    const name = String(data.name || "").trim();
    const university = String(data.university || "").trim();
    const course = String(data.course || "").trim();
    const comment = String(data.comment || "").trim();
    const rating = Number(data.rating);

    if (!name || !university || !course || !comment) {
      throw createError("Please complete all review fields.");
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw createError("Please choose a rating from 1 to 5 stars.");
    }

    const store = readStore();
    const review = {
      id: nextId(store.reviews),
      name,
      university,
      course,
      comment,
      rating,
      photo: String(data.photo || ""),
      status,
      created_at: new Date().toISOString(),
    };
    store.reviews.push(review);
    writeStore(store);
    return respond({ review });
  },

  submit: async (data) => reviewAPI.create(data, "pending"),

  update: async (id, data) => {
    const name = String(data.name || "").trim();
    const university = String(data.university || "").trim();
    const course = String(data.course || "").trim();
    const comment = String(data.comment || "").trim();
    const rating = Number(data.rating);
    if (!name || !university || !course || !comment) {
      throw createError("Please complete all review fields.");
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw createError("Please choose a rating from 1 to 5 stars.");
    }

    const store = readStore();
    const review = store.reviews.find((item) => item.id === Number(id));
    if (!review) throw createError("Review not found.", 404);
    Object.assign(review, {
      name,
      university,
      course,
      comment,
      rating,
      photo: String(data.photo || review.photo || ""),
    });
    writeStore(store);
    return respond({ review });
  },

  setStatus: async (id, status) => {
    if (!["pending", "approved"].includes(status)) {
      throw createError("Review status must be pending or approved.");
    }
    const store = readStore();
    const review = store.reviews.find((item) => item.id === Number(id));
    if (!review) throw createError("Review not found.", 404);
    review.status = status;
    writeStore(store);
    return respond({ review });
  },

  delete: async (id) => {
    const store = readStore();
    const reviewIndex = store.reviews.findIndex(
      (item) => item.id === Number(id),
    );
    if (reviewIndex === -1) throw createError("Review not found.", 404);
    store.reviews.splice(reviewIndex, 1);
    writeStore(store);
    return respond({ message: "Review deleted." });
  },
};

const normalizeContent = (data, fields, label, requiredFields = fields) => {
  const content = Object.fromEntries(
    fields.map((field) => [field, String(data[field] || "").trim()]),
  );
  if (requiredFields.some((field) => !content[field])) {
    throw createError(`Please complete the required ${label} fields.`);
  }
  return content;
};

const isHttpUrl = (value) => {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};

const validateContentUrls = (collection, content) => {
  if (
    collection === "universities" &&
    !isHttpUrl(content.apply)
  ) {
    throw createError("University application URL must use HTTP or HTTPS.");
  }
  if (
    collection === "universities" &&
    content.officialSite &&
    !isHttpUrl(content.officialSite)
  ) {
    throw createError("University website URL must use HTTP or HTTPS.");
  }
  if (
    collection === "universities" &&
    content.image &&
    !(isHttpUrl(content.image) || content.image.startsWith("data:image/"))
  ) {
    throw createError("University photo must be a valid image URL.");
  }
  if (
    collection === "consultants" &&
    content.photo &&
    !(
      isHttpUrl(content.photo) ||
      content.photo.startsWith("/assets/") ||
      content.photo.startsWith("data:image/")
    )
  ) {
    throw createError("Consultant photo must be a valid image URL.");
  }
};

const createContentAPI = (collection, fields, label, requiredFields = fields) => ({
  getAll: async () => respond({ [collection]: readStore()[collection] }),

  create: async (data) => {
    const store = readStore();
    const content = normalizeContent(data, fields, label, requiredFields);
    validateContentUrls(collection, content);
    const item = {
      ...content,
      id: nextId(store[collection]),
    };
    if (collection === "consultants") {
      item.fee = Number(data.fee);
      if (!Number.isFinite(item.fee) || item.fee < 0) {
        throw createError("Consultation fee must be a non-negative number.");
      }
    }
    store[collection].push(item);
    writeStore(store);
    return respond({ [label]: item });
  },

  update: async (id, data) => {
    const store = readStore();
    const item = store[collection].find((entry) => entry.id === Number(id));
    if (!item) throw createError(`${label} not found.`, 404);
    const updated = normalizeContent(data, fields, label, requiredFields);
    validateContentUrls(collection, updated);
    if (collection === "consultants") {
      const fee = Number(data.fee);
      if (!Number.isFinite(fee) || fee < 0) {
        throw createError("Consultation fee must be a non-negative number.");
      }
      item.fee = fee;
    }
    Object.assign(item, updated);
    writeStore(store);
    return respond({ [label]: item });
  },

  delete: async (id) => {
    const store = readStore();
    const initialLength = store[collection].length;
    store[collection] = store[collection].filter(
      (item) => item.id !== Number(id),
    );
    if (store[collection].length === initialLength) {
      throw createError(`${label} not found.`, 404);
    }
    writeStore(store);
    return respond({ message: `${label} deleted.` });
  },
});

export const consultantAPI = createContentAPI(
  "consultants",
  [
    "name",
    "role",
    "photo",
    "section",
    "experience",
    "available",
    "address",
    "tag",
    "office",
  ],
  "consultant",
  ["name", "role"],
);

export const universityAPI = createContentAPI(
  "universities",
  [
    "country",
    "name",
    "type",
    "location",
    "tuition",
    "image",
    "officialSite",
    "apply",
  ],
  "university",
);

export const appointmentAPI = {
  getSlots: async (doctor, date) => {
    const bookedSlots = readStore().appointments
      .filter(
        (item) =>
          item.doctor_name === doctor &&
          item.appointment_date === date &&
          item.status !== "Cancelled",
      )
      .map((item) => item.time_slot);
    return respond({ bookedSlots });
  },

  book: async (data) => {
    const user = requireCurrentUser();
    const store = readStore();
    const alreadyBooked = store.appointments.some(
      (item) =>
        item.doctor_name === data.doctor_name &&
        item.appointment_date === data.appointment_date &&
        item.time_slot === data.time_slot &&
        item.status !== "Cancelled",
    );
    if (alreadyBooked) throw createError("That time slot is no longer available.", 409);

    const appointment = {
      ...data,
      id: nextId(store.appointments),
      user_id: user.id,
      patient_name: user.name,
      patient_mobile: user.mobile,
      status: "Pending",
      created_at: new Date().toISOString(),
    };
    store.appointments.push(appointment);
    writeStore(store);
    return respond({ appointmentId: appointment.id, appointment });
  },

  getMyAppointments: async () => {
    const user = requireCurrentUser();
    const appointments = readStore().appointments.filter(
      (item) => item.user_id === user.id,
    );
    return respond({ appointments });
  },

  cancelAppointment: async (id) => {
    const user = requireCurrentUser();
    const store = readStore();
    const appointment = store.appointments.find(
      (item) => item.id === Number(id) && item.user_id === user.id,
    );
    if (!appointment) throw createError("Consultation not found.", 404);
    appointment.status = "Cancelled";
    writeStore(store);
    return respond({ appointment });
  },
};

const adminLogin = async ({ mobile, password }) => {
  if (mobile !== "admin" || password !== "admin123") {
    throw createError("Invalid admin credentials.", 401);
  }

  const admin = { name: "Administrator", mobile: "admin" };
  const token = `demo-admin-${Date.now()}`;
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminInfo", JSON.stringify(admin));
  return respond({ token, admin });
};

export const adminAPI = {
  login: adminLogin,

  getStats: async () => {
    const { users, appointments, messages } = readStore();
    const today = new Date().toISOString().slice(0, 10);
    const countStatus = (status) =>
      appointments.filter((item) => item.status === status).length;
    const stats = {
      totalUsers: users.length,
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter(
        (item) => item.appointment_date === today,
      ).length,
      newMessages: messages.filter((item) => item.status === "New").length,
      totalMessages: messages.length,
      totalRevenue: appointments
        .filter((item) => item.status === "Completed")
        .reduce((sum, item) => sum + (Number(item.fee) || 0), 0),
      pendingAppointments: countStatus("Pending"),
      confirmedAppointments: countStatus("Confirmed"),
      completedAppointments: countStatus("Completed"),
      cancelledAppointments: countStatus("Cancelled"),
    };
    return respond({
      stats,
      recentAppointments: [...appointments].slice(-5).reverse(),
      recentMessages: messages.slice(0, 5),
    });
  },

  getUsers: async () =>
    respond({ users: readStore().users.map(safeUser) }),

  toggleUserStatus: async (id) => {
    const store = readStore();
    const user = store.users.find((item) => item.id === Number(id));
    if (!user) throw createError("User not found.", 404);
    user.is_active = user.is_active ? 0 : 1;
    writeStore(store);
    return respond({ isActive: Boolean(user.is_active) });
  },

  deleteUser: async (id) => {
    const store = readStore();
    const userId = Number(id);
    store.users = store.users.filter((item) => item.id !== userId);
    store.appointments = store.appointments.filter(
      (item) => item.user_id !== userId,
    );
    writeStore(store);
    return respond({ message: "User deleted." });
  },

  getAppointments: async (params = {}) => {
    let appointments = readStore().appointments;
    if (params.status) {
      appointments = appointments.filter((item) => item.status === params.status);
    }
    if (params.date) {
      appointments = appointments.filter(
        (item) => item.appointment_date === params.date,
      );
    }
    if (params.doctor) {
      appointments = appointments.filter((item) =>
        item.doctor_name.toLowerCase().includes(params.doctor.toLowerCase()),
      );
    }
    return respond({ appointments });
  },

  updateAppointmentStatus: async (id, status) => {
    const store = readStore();
    const appointment = store.appointments.find(
      (item) => item.id === Number(id),
    );
    if (!appointment) throw createError("Consultation not found.", 404);
    appointment.status = status;
    writeStore(store);
    return respond({ appointment });
  },

  getMessages: async (params = {}) => {
    let messages = readStore().messages;
    if (params.status) {
      messages = messages.filter((item) => item.status === params.status);
    }
    return respond({ messages });
  },

  updateMessageStatus: async (id, status) => contactAPI.updateStatus(id, status),
  deleteMessage: async (id) => contactAPI.deleteMessage(id),
};
