Title: Notes
Slug: notes
Template: page

<style>
  .notes-container {
    max-width: 900px;
    margin: 0 auto;
    padding-top: 12px;
  }
  .notes-hero {
    display: grid;
    gap: 14px;
    margin-bottom: 18px;
  }
  .notes-hero h1 {
    font-size: clamp(20px, 3vw, 24px);
    font-weight: 500;
  }
  .notes-hero p {
    font-size: clamp(12.5px, 1.55vw, 14px);
    color: #2a2f3a;
    line-height: 1.6;
  }
  .note-card {
    border: 1px solid #e8ebf3;
    border-radius: 12px;
    padding: 18px 18px 14px 18px;
    margin-bottom: 14px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 26px rgba(0,0,0,0.04);
  }
  .note-card h2 {
    font-size: clamp(16px, 2vw, 18px);
    font-weight: 500;
    margin-bottom: 6px;
  }
  .note-links {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
  }
  .note-links li {
    margin: 0;
  }
  .note-link-card {
    display: block;
    padding: 12px 14px;
    border: 1px solid #e5e8f0;
    border-radius: 10px;
    background: #f9fbff;
    color: #111111;
    text-decoration: none;
    font-size: clamp(12px, 1.5vw, 13px);
    transition: transform 120ms ease, box-shadow 140ms ease, border-color 140ms ease;
  }
  .note-link-card:hover {
    transform: translateY(-1px);
    border-color: #cfd7ff;
    box-shadow: 0 10px 24px rgba(75, 107, 251, 0.12);
  }
  .pill {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 999px;
    background: #eef2ff;
    color: #30407a;
    font-size: clamp(11px, 1.4vw, 12px);
    border: 1px solid #dfe6ff;
    margin-left: 8px;
  }
</style>

<div class="notes-container">
  <div class="notes-hero">
    <h1>Class Notes</h1>
    <p>Select a course to view study guides or problem sets. Files are stored under <code>notes/</code> as PDFs.</p>
  </div>

  <div class="note-card">
    <h2>MA 266 — Ordinary Differential Equations <span class="pill">Problem Sets</span></h2>
    <p class="simple-text" style="margin: 6px 0 10px 0;">
      These problems are all the final exam problems from the last few years, grouped by topic. 
      See <a href="https://www.boilerexams.com/">Boilerexams</a> for more problems. 
      These written solutions are meant for quick revision, watch the Boilerexams videos for in-depth explanations.
    </p>
    <ul class="note-links">
      <li><a class="note-link-card" href="notes/ma266/Homogenous%20DiffEqs.pdf">Homogenous Differential Equations</a></li>
      <li><a class="note-link-card" href="notes/ma266/Reduction%20Of%20Order%202.pdf">Reduction of Order</a></li>
      <li><a class="note-link-card" href="notes/ma266/Exact%20Equations.pdf">Exact Equations</a></li>
      <li><a class="note-link-card" href="notes/ma266/Existence%20And%20Uniqueness.pdf">Existence and Uniqueness</a></li>
      <li><a class="note-link-card" href="notes/ma266/Integrating%20Factor.pdf">Integrating Factor</a></li>
      <li><a class="note-link-card" href="notes/ma266/Kinematics.pdf">Kinematics</a></li>
      <li><a class="note-link-card" href="notes/ma266/Population.pdf">Population</a></li>
      <li><a class="note-link-card" href="notes/ma266/Separation%20Of%20Variables.pdf">Separation of Variables</a></li>
    </ul>
  </div>

  <div class="note-card">
    <h2>ECE 20002 — Electrical Engineering Fundamentals II <span class="pill">Coming soon</span></h2>
    <p class="simple-text" style="margin-top: 6px;">Study guides and problem sets are coming soon.</p>
  </div>
</div>
