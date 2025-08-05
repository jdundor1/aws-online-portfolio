document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      populateAbout(data.about);
      populateSkills(data.skills);
      populateExperience(data.experience);
      populateProjects(data.projects);
      populateCertifications(data.certifications);
      populateEducation(data.education);
      enableResume(data.resumeFile);
    });

  function populateAbout(about) {
    const aboutSection = document.querySelector("#about");
    const container = document.createElement("div");
    container.className = "space-y-4";
    about.paragraphs.forEach(p => {
      const para = document.createElement("p");
      para.className = "text-lg leading-relaxed";
      para.textContent = p;
      container.appendChild(para);
    });
    aboutSection.appendChild(container);
  }

  function populateSkills(skills) {
    const skillsContainer = document.querySelector("#skills .grid");
    skills.forEach(skill => {
      const div = document.createElement("div");
      div.className = "bg-gray-800 p-6 rounded-lg shadow-md";
      div.innerHTML = `<h3 class="text-xl font-semibold mb-2">${skill.title}</h3>
                       <p class="text-gray-400">${skill.description}</p>`;
      skillsContainer.appendChild(div);
    });
  }

  function populateExperience(experiences) {
    const container = document.querySelector("#experience .space-y-8");
    experiences.forEach(exp => {
      const div = document.createElement("div");
      div.innerHTML = `<h3 class="text-xl font-semibold">${exp.title}</h3>
                       <p class="text-gray-400 italic">${exp.company} | ${exp.dates}</p>
                       <ul class="list-disc list-inside text-gray-300 mt-2">
                         ${exp.responsibilities.map(item => `<li>${item}</li>`).join("")}
                       </ul>`;
      container.appendChild(div);
    });
  }

  function populateProjects(projects) {
    const container = document.querySelector("#projects .grid");
    projects.forEach(proj => {
      const div = document.createElement("div");
      div.className = "bg-gray-800 p-6 rounded-lg shadow-md";
      div.innerHTML = `<h3 class="text-xl font-semibold mb-2">${proj.title}</h3>
                       <p class="text-gray-400 mb-4">${proj.description}</p>
                       <a href="${proj.githubUrl}" target="_blank" class="text-cyan-400 hover:underline mr-4">GitHub</a>
                       ${proj.liveDemoUrl ? `<a href="${proj.liveDemoUrl}" target="_blank" class="text-cyan-400 hover:underline">Live Demo</a>` : ""}`;
      container.appendChild(div);
    });
  }

  function populateCertifications(certs) {
    const container = document.querySelector("#certifications .flex");
    certs.forEach(cert => {
      const div = document.createElement("div");
      div.className = "text-center";
      div.innerHTML = `<img src="${cert.badgeFile}" alt="${cert.name}" class="mx-auto h-20 mb-2">
                       <p class="text-sm">${cert.name}</p>`;
      container.appendChild(div);
    });
  }

  function populateEducation(education) {
    const container = document.querySelector("#education-list");
    education.forEach(edu => {
      const div = document.createElement("div");
      div.className = "bg-gray-800 p-6 rounded-lg shadow-md";
      div.innerHTML = `<h3 class="text-xl font-semibold">${edu.degree}</h3>
                       <p class="text-gray-400">${edu.school}</p>
                       <p class="text-sm text-gray-500">${edu.dates}</p>`;
      container.appendChild(div);
    });
  }

  function enableResume(resumeUrl) {
    const resumeLink = document.getElementById("heroResumeLink");
    resumeLink.classList.remove("hidden");
    resumeLink.href = resumeUrl;
  }
});
