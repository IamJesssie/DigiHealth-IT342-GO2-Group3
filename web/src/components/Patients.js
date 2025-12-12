import React, { useState, useEffect } from "react";
import "./PageStyling.css";
import apiClient from "../api/client";
import { PageWrapper, PageMessage, PageFolder } from "./PageComponents";
import { useAuth } from "../auth/auth";
import { useAppointmentUpdates } from "../hooks/useAppointmentUpdates";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({
    noteText: "",
    diagnosis: "",
    prescriptions: "",
    observations: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterLabel, setFilterLabel] = useState("All Patients");
  const [filterType, setFilterType] = useState("ALL");
  const [notesFilter, setNotesFilter] = useState("ALL");
  const [notesPage, setNotesPage] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [patientsPage, setPatientsPage] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [deletedBuffer, setDeletedBuffer] = useState(null);
  const [detailsForm, setDetailsForm] = useState({
    age: "",
    gender: "",
    allergies: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodType: "",
    birthDate: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const auth = useAuth();
  const currentUser = auth?.currentUser || null;
  const [live, setLive] = useState(false);

  const PATIENTS_URL = "/api/doctors/me/patients";
  const SEARCH_URL = "/api/doctors/me/patients/search";

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/doctors/me/patients/page", {
          params: {
            page: patientsPage.page,
            size: patientsPage.size,
            q: query,
          },
        });
        const data = res.data;
        setPatients(data.content || []);
        setPatientsPage((prev) => ({
          page: data.page ?? prev.page,
          size: data.size ?? prev.size,
          totalPages: data.totalPages ?? prev.totalPages,
        }));
      } catch (err) {
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [patientsPage.page, patientsPage.size, query]);

  const refetchPatients = async () => {
    try {
      const res = await apiClient.get("/api/doctors/me/patients/page", {
        params: { page: patientsPage.page, size: patientsPage.size, q: query },
      });
      const data = res.data;
      setPatients(data.content || []);
      setPatientsPage((prev) => ({
        page: data.page ?? prev.page,
        size: data.size ?? prev.size,
        totalPages: data.totalPages ?? prev.totalPages,
      }));
    } catch (err) {
      // silent
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);
    setPatientsPage((prev) => ({ ...prev, page: 0 }));
  };

  const loadNotes = async (patientId) => {
    try {
      const res = await apiClient.get(
        `/api/doctors/me/patients/${patientId}/notes/page`,
        { params: { page: notesPage.page, size: notesPage.size } }
      );
      const data = res.data;
      setNotes(data.content || []);
      setNotesPage({
        page: data.page || 0,
        size: data.size || notesPage.size,
        totalPages: data.totalPages || 0,
      });
    } catch (err) {
      setNotes([]);
    }
  };

  const openPatient = async (patient) => {
    setSelectedPatient(patient);
    await loadNotes(patient.id);
    try {
      const res = await apiClient.get(
        `/api/doctors/me/patients/${patient.id}/details`
      );
      const p = res.data || {};
      setDetailsForm({
        age: p.age ?? "",
        gender: p.gender ?? "",
        allergies: p.allergies ?? "",
        medicalConditions: p.medicalConditions ?? "",
        emergencyContactName: p.emergencyContactName ?? "",
        emergencyContactPhone: p.emergencyContactPhone ?? "",
        bloodType: p.bloodType ?? "",
        birthDate: p.birthDate ?? "",
        street: p.street ?? "",
        city: p.city ?? "",
        state: p.state ?? "",
        postalCode: p.postalCode ?? "",
        country: p.country ?? "",
      });
    } catch {}
  };

  useAppointmentUpdates(async () => {
    setLive(true);
    await refetchPatients();
    if (selectedPatient) {
      await loadNotes(selectedPatient.id);
    }
    setTimeout(() => setLive(false), 2000);
  });

  const saveNote = async () => {
    if (!selectedPatient) return;
    try {
      const res = await apiClient.post(
        `/api/doctors/me/patients/${selectedPatient.id}/notes`,
        noteForm
      );
      // Prepend newly saved note
      setNotes([res.data, ...notes]);
      setNoteForm({
        noteText: "",
        diagnosis: "",
        prescriptions: "",
        observations: "",
      });
    } catch (err) {
      alert("Failed to save note");
    }
  };

  const updateNote = async (noteId, payload) => {
    try {
      const res = await apiClient.put(
        `/api/doctors/me/patients/${selectedPatient.id}/notes/${noteId}`,
        payload
      );
      setNotes(notes.map((n) => (n.id === noteId ? res.data : n)));
      setEditingNoteId(null);
    } catch (err) {
      alert("Failed to update note");
    }
  };

  const deleteNote = async (note) => {
    try {
      await apiClient.delete(
        `/api/doctors/me/patients/${selectedPatient.id}/notes/${note.id}`
      );
      setDeletedBuffer({ note, timestamp: Date.now() });
      setNotes(notes.filter((n) => n.id !== note.id));
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  const saveDetails = async () => {
    if (!selectedPatient) return;
    try {
      const payload = {
        age: detailsForm.age ? Number(detailsForm.age) : null,
        gender: detailsForm.gender || "OTHER",
        allergies: detailsForm.allergies || "",
        medicalConditions: detailsForm.medicalConditions || "",
        emergencyContactName: detailsForm.emergencyContactName || "",
        emergencyContactPhone: detailsForm.emergencyContactPhone || "",
        bloodType: detailsForm.bloodType || "",
        birthDate: detailsForm.birthDate || null,
        street: detailsForm.street || "",
        city: detailsForm.city || "",
        state: detailsForm.state || "",
        postalCode: detailsForm.postalCode || "",
        country: detailsForm.country || "",
      };
      await apiClient.put(
        `/api/doctors/me/patients/${selectedPatient.id}/details`,
        payload
      );
      alert("Patient details saved");
    } catch (err) {
      alert("Failed to save patient details");
    }
  };

  const undoDelete = async () => {
    if (!deletedBuffer || !selectedPatient) return;
    const { note } = deletedBuffer;
    try {
      const res = await apiClient.post(
        `/api/doctors/me/patients/${selectedPatient.id}/notes`,
        {
          appointmentId: note.appointmentId,
          noteText: note.noteText,
          diagnosis: note.diagnosis,
          prescriptions: note.prescriptions,
          observations: note.observations,
        }
      );
      setNotes([res.data, ...notes]);
      setDeletedBuffer(null);
    } catch (err) {
      alert("Failed to undo delete");
    }
  };

  const notesByFilter = (list) => {
    const now = Date.now();
    if (notesFilter === "LAST7") {
      return list.filter(
        (n) =>
          n.createdAt &&
          now - new Date(n.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000
      );
    } else if (notesFilter === "LAST30") {
      return list.filter(
        (n) =>
          n.createdAt &&
          now - new Date(n.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000
      );
    }
    return list;
  };

  const groupedNotes = () => {
    const filtered = notesByFilter(notes);
    const groups = {};
    filtered.forEach((n) => {
      const d = new Date(n.createdAt);
      const key = d.toLocaleDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const applyFilter = (list) => {
    if (!Array.isArray(list)) return [];
    const now = new Date();
    switch (filterType) {
      case "RECENT":
        return list.filter((p) => {
          if (!p.lastVisit) return false;
          try {
            const lv = new Date(p.lastVisit);
            const diffDays = Math.floor((now - lv) / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
          } catch {
            return false;
          }
        });
      case "NOVISIT":
        return list.filter((p) => !p.lastVisit);
      default:
        return list;
    }
  };

  const displayPatients = applyFilter(patients);

  return (
    <PageWrapper>
      <PageMessage
        title="My Patients"
        message="View patients assigned to your care"
      >
        {currentUser && currentUser.role !== "DOCTOR" && (
          <div className="undo-bar" style={{ marginBottom: 12 }}>
            <span>Access limited. This section is for doctors.</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              background: live ? "#22c55e" : "#9ca3af",
              boxShadow: live ? "0 0 6px #22c55e" : "none",
            }}
          />
          <span style={{ fontSize: 12, color: "#6b7280" }}>Live</span>
        </div>
      </PageMessage>

      <PageFolder>
        <div className="search-card">
          <div className="search-bar">
            <img src="/assets/search-icon.svg" alt="Search" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={query}
              onChange={handleSearch}
            />
          </div>
          <div
            className="filter-dropdown"
            onClick={() => setFilterOpen(!filterOpen)}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
          >
            <span>{filterLabel}</span>
            <img src="/assets/dropdownicon.svg" alt="Filter" />
            {filterOpen && (
              <div className="filter-menu" role="listbox">
                <button
                  className="filter-item"
                  onClick={() => {
                    setFilterType("ALL");
                    setFilterLabel("All Patients");
                    setFilterOpen(false);
                  }}
                >
                  All Patients
                </button>
                <button
                  className="filter-item"
                  onClick={() => {
                    setFilterType("RECENT");
                    setFilterLabel("Recent Visits (≤30d)");
                    setFilterOpen(false);
                  }}
                >
                  Recent Visits (≤30d)
                </button>
                <button
                  className="filter-item"
                  onClick={() => {
                    setFilterType("NOVISIT");
                    setFilterLabel("No Visit History");
                    setFilterOpen(false);
                  }}
                >
                  No Visit History
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="patients-table-card">
          <div className="table-header">
            <h3>Patient Records</h3>
            <p>
              Showing 1-{displayPatients.length} of {displayPatients.length}{" "}
              patients
            </p>
          </div>
          <table className="page-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {displayPatients.length === 0 ? (
                <tr>
                  <td colSpan="5">No patients found</td>
                </tr>
              ) : (
                displayPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id ? patient.id.slice(0, 8) : "N/A"}</td>
                    <td>{patient.name || "N/A"}</td>
                    <td>{patient.phone || "N/A"}</td>
                    <td>{patient.email || "N/A"}</td>
                    <td>{patient.lastVisit || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-primary-sm"
                        onClick={() => openPatient(patient)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="table-footer">
            <p>
              Page {patientsPage.page + 1} of{" "}
              {Math.max(patientsPage.totalPages, 1)}
            </p>
            <div className="pagination-buttons">
              <button
                disabled={patientsPage.page <= 0}
                onClick={() =>
                  setPatientsPage((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 0),
                  }))
                }
              >
                <img src="/assets/previcon.svg" alt="Previous" /> Previous
              </button>
              <button
                disabled={patientsPage.page >= patientsPage.totalPages - 1}
                onClick={() =>
                  setPatientsPage((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next <img src="/assets/nexticon.svg" alt="Next" />
              </button>
            </div>
          </div>
        </div>
        {selectedPatient && (
          <div className="card patients-notes-card" style={{ marginTop: 20 }}>
            <div className="table-header">
              <h3>Consultation Notes — {selectedPatient.name}</h3>
              <p>Write and review clinical notes, diagnosis, prescriptions</p>
            </div>
            <div className="notes-toolbar">
              <div className="notes-filter">
                <label>Show:</label>
                <select
                  value={notesFilter}
                  onChange={(e) => setNotesFilter(e.target.value)}
                >
                  <option value="ALL">All</option>
                  <option value="LAST7">Last 7 days</option>
                  <option value="LAST30">Last 30 days</option>
                </select>
              </div>
              <div className="notes-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    const printHtml = `<!doctype html><html><head><title>Notes - ${
                      selectedPatient.name
                    }</title><style>body{font-family:Arial;padding:24px} h1{margin-bottom:8px} .note{margin-bottom:16px;border-bottom:1px solid #eee;padding-bottom:12px}</style></head><body><h1>Patient Notes — ${
                      selectedPatient.name
                    }</h1>${notes
                      .map(
                        (n) =>
                          `<div class='note'><div><strong>${new Date(
                            n.createdAt
                          ).toLocaleString()}</strong></div><div>${
                            n.noteText || ""
                          }</div>${
                            n.diagnosis
                              ? `<div><strong>Dx:</strong> ${n.diagnosis}</div>`
                              : ""
                          }${
                            n.prescriptions
                              ? `<div><strong>Rx:</strong> ${n.prescriptions}</div>`
                              : ""
                          }${
                            n.observations
                              ? `<div><strong>Obs:</strong> ${n.observations}</div>`
                              : ""
                          }</div>`
                      )
                      .join("")}</body></html>`;
                    const w = window.open("", "_blank");
                    w.document.write(printHtml);
                    w.document.close();
                    w.focus();
                    w.print();
                  }}
                >
                  Export PDF
                </button>
              </div>
            </div>
            <div className="notes-grid">
              <div className="notes-form">
                <div className="form-group">
                  <label>Consultation Notes</label>
                  <div className="rte-toolbar">
                    <button
                      type="button"
                      onClick={() => {
                        const currentText = noteForm.noteText || '';
                        const soapTemplate = '\n\nSubjective:\nObjective:\nAssessment:\nPlan:';
                        setNoteForm({
                          ...noteForm,
                          noteText: currentText + soapTemplate,
                        });
                      }}
                    >
                      Insert SOAP
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNoteForm({
                          ...noteForm,
                          noteText: `${
                            noteForm.noteForm ? noteForm.noteForm : ""
                          }`,
                        })
                      }
                      disabled
                      style={{ opacity: 0.6 }}
                    >
                      Templates...
                    </button>
                  </div>
                  <textarea
                    className="rte-editor"
                    value={noteForm.noteText}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        noteText: e.target.value,
                      })
                    }
                    rows={6}
                    style={{
                      minHeight: 120,
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: 12,
                      fontFamily: "Arial, sans-serif",
                      fontSize: 14,
                      resize: "vertical",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter consultation notes here..."
                  />
                
                </div>
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input
                    type="text"
                    value={noteForm.diagnosis}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, diagnosis: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Prescriptions</label>
                  <textarea
                    value={noteForm.prescriptions}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        prescriptions: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Observations</label>
                  <textarea
                    value={noteForm.observations}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, observations: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="dialog-footer">
                  <button className="btn btn-gradient" onClick={saveNote}>
                    Save Note
                  </button>
                </div>
              </div>
              <div className="notes-list">
                {notes.length === 0 ? (
                  <p>No notes yet</p>
                ) : (
                  <div>
                    {Object.entries(groupedNotes()).map(([day, list]) => (
                      <div key={day} style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>
                          {day}
                        </div>
                        <ul>
                          {list.map((n) => (
                            <li key={n.id} style={{ marginBottom: 12 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ fontWeight: 600 }}>
                                  {new Date(n.createdAt).toLocaleString()}
                                </div>
                                <div>
                                  <button
                                    className="btn btn-primary-sm"
                                    onClick={() => setEditingNoteId(n.id)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger-sm"
                                    onClick={() => deleteNote(n)}
                                    style={{ marginLeft: 8 }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              {editingNoteId === n.id ? (
                                <div>
                                  <textarea
                                    defaultValue={n.noteText}
                                    onBlur={(e) =>
                                      updateNote(n.id, {
                                        noteText: e.target.value,
                                        diagnosis: n.diagnosis,
                                        prescriptions: n.prescriptions,
                                        observations: n.observations,
                                      })
                                    }
                                    rows={3}
                                  />
                                </div>
                              ) : (
                                <div>{n.noteText}</div>
                              )}
                              {n.diagnosis && (
                                <div>
                                  <strong>Dx:</strong> {n.diagnosis}
                                </div>
                              )}
                              {n.prescriptions && (
                                <div>
                                  <strong>Rx:</strong> {n.prescriptions}
                                </div>
                              )}
                              {n.observations && (
                                <div>
                                  <strong>Obs:</strong> {n.observations}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {deletedBuffer && (
                  <div className="undo-bar">
                    <span>Note deleted.</span>
                    <button className="btn btn-outline" onClick={undoDelete}>
                      Undo
                    </button>
                  </div>
                )}
                <div className="pagination-buttons" style={{ marginTop: 8 }}>
                  <button
                    disabled={notesPage.page <= 0}
                    onClick={() => {
                      setNotesPage({ ...notesPage, page: notesPage.page - 1 });
                      loadNotes(selectedPatient.id);
                    }}
                  >
                    Prev
                  </button>
                  <span style={{ margin: "0 8px" }}>
                    Page {notesPage.page + 1} of {notesPage.totalPages}
                  </span>
                  <button
                    disabled={notesPage.page >= notesPage.totalPages - 1}
                    onClick={() => {
                      setNotesPage({ ...notesPage, page: notesPage.page + 1 });
                      loadNotes(selectedPatient.id);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedPatient && (
          <div className="card" style={{ marginTop: 20 }}>
            <div className="table-header">
              <h3>Patient Details — {selectedPatient.name}</h3>
              <p>Update demographics and medical information</p>
            </div>
            <div className="notes-grid">
              <div className="notes-form">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={detailsForm.age}
                    onChange={(e) =>
                      setDetailsForm({ ...detailsForm, age: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={detailsForm.gender}
                    onChange={(e) =>
                      setDetailsForm({ ...detailsForm, gender: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Type</label>
                  <input
                    type="text"
                    value={detailsForm.bloodType}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        bloodType: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    value={detailsForm.birthDate}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    value={detailsForm.emergencyContactName}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        emergencyContactName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={detailsForm.emergencyContactPhone}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Allergies</label>
                  <textarea
                    rows={2}
                    value={detailsForm.allergies}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        allergies: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Medical Conditions</label>
                  <textarea
                    rows={2}
                    value={detailsForm.medicalConditions}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        medicalConditions: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    value={detailsForm.street}
                    onChange={(e) =>
                      setDetailsForm({ ...detailsForm, street: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={detailsForm.city}
                    onChange={(e) =>
                      setDetailsForm({ ...detailsForm, city: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={detailsForm.state}
                    onChange={(e) =>
                      setDetailsForm({ ...detailsForm, state: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={detailsForm.postalCode}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={detailsForm.country}
                    onChange={(e) =>
                      setDetailsForm({
                        ...detailsForm,
                        country: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="dialog-footer">
                  <button className="btn btn-gradient" onClick={saveDetails}>
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageFolder>
    </PageWrapper>
  );
};

export default Patients;
