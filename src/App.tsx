import { useEffect, useState } from "react";
import "./App.css";

type JobApplication = {
  id: number;
  company: string;
  jobTitle: string;
  status: string;
  applicationDate: string;
  hiringManagerName: string;
  hiringManagerEmail: string;
  notes: string;
};

function App() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [form, setForm] = useState<JobApplication>({
    id: 0,
    company: "",
    jobTitle: "",
    status: "",
    applicationDate: "",
    hiringManagerName: "",
    hiringManagerEmail: "",
    notes: "",
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications) {
      return JSON.parse(savedApplications);
    }

    return [];
  });


  useEffect(() => {
    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );
  }, [applications]);


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.company ||
      !form.jobTitle ||
      !form.status ||
      !form.applicationDate ||
      !form.hiringManagerName ||
      !form.hiringManagerEmail
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.hiringManagerEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");

    if (editingId !== null) {
      const updatedApplications = applications.map((application) => {
        if (application.id === editingId) {
          return form;
        }

        return application;
      });

      setApplications(updatedApplications);
      setEditingId(null);
    } else {
      const newApplication = {
        ...form,
        id: Date.now(),
      };

      setApplications([...applications, newApplication]);
    }

    setForm({
      id: 0,
      company: "",
      jobTitle: "",
      status: "",
      applicationDate: "",
      hiringManagerName: "",
      hiringManagerEmail: "",
      notes: "",
    });
  }

  function deleteApplication(idToDelete: number) {
    setApplications(
      applications.filter(
        (application) => application.id !== idToDelete
      )
    );
  }

  const filteredApplications = applications.filter((application) => {
    const matchesSearch = application.company
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const dateA = new Date(a.applicationDate).getTime();
    const dateB = new Date(b.applicationDate).getTime();

    if (sortOrder === "newest") {
      return dateB - dateA;
    }

    return dateA - dateB;
  });


  const totalApplications = applications.length;

  const appliedApplications = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const interviewApplications = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  const offerApplications = applications.filter(
    (application) => application.status === "Offer"
  ).length;


  return (
    <main>
      <h1>Job Application Tracker</h1>
      <p>Track your job applications and interview progress.</p>

      <form onSubmit={handleSubmit}>
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <input
          name="jobTitle"
          placeholder="Job title"
          value={form.jobTitle}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="">Select status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <input
          name="applicationDate"
          type="date"
          value={form.applicationDate}
          onChange={handleChange}
        />

        <input
          name="hiringManagerName"
          placeholder="Hiring manager name"
          value={form.hiringManagerName}
          onChange={handleChange}
        />

        <input
          name="hiringManagerEmail"
          placeholder="Hiring manager email"
          value={form.hiringManagerEmail}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId !== null ? "Update Application" : "Add Application"}
        </button>

        {errorMessage && (
          <p className="error">{errorMessage}</p>
        )}
      </form>

      <section className="stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Applied</h3>
          <p>{appliedApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Interview</h3>
          <p>{interviewApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{rejectedApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Offers</h3>
          <p>{offerApplications}</p>
        </div>
      </section>

      <input
        placeholder="Search by company"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Statuses</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>

      {sortedApplications.map((application) => (
        <div className="application-card" key={application.id}>
          <h3>{application.company}</h3>

          <p>{application.jobTitle}</p>

          <p>Status: {application.status}</p>

          <p>Applied: {application.applicationDate}</p>

          <p>Hiring Manager: {application.hiringManagerName}</p>

          <p>{application.hiringManagerEmail}</p>

          <p>{application.notes}</p>

          <button
            onClick={() => {
              setForm(application);
              setEditingId(application.id);
            }}
          >
            Edit
          </button>

          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete this application?"
              );

              if (confirmed) {
                deleteApplication(application.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}

export default App;