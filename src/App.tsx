import { useState } from "react";
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
  const [applications, setApplications] = useState<JobApplication[]>([]);
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

    const newApplication = {
      ...form,
      id: Date.now(),
    };

    setApplications([...applications, newApplication]);

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

        <button type="submit">Add Application</button>
      </form>

      <p>Total Applications: {applications.length}</p>

      {applications.map((application) => (
        <div className="application-card" key={application.id}>
          <h3>{application.company}</h3>

          <p>{application.jobTitle}</p>

          <p>Status: {application.status}</p>

          <p>Applied: {application.applicationDate}</p>

          <p>Hiring Manager: {application.hiringManagerName}</p>

          <p>{application.hiringManagerEmail}</p>

          <p>{application.notes}</p>
        </div>
      ))}
    </main>
  );
}

export default App;