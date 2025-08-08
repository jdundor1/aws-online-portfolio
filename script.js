fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // About
    document.getElementById('about-content').innerHTML =
      data.about.paragraphs.map(p => `<p class="mb-4">${p}</p>`).join('');

    // Skills
    document.getElementById('skills-list').innerHTML =
      data.skills.map(skill =>
        `<div class="bg-gray-800 p-4 rounded-lg shadow">${skill.title ? `<h3 class="text-xl font-semibold mb-2">${skill.title}</h3>` : ''}<p>${skill.description}</p></div>`
      ).join('');

    // Experience
    document.getElementById('experience-list').innerHTML =
      data.experience.map(exp =>
        `<div><h3 class="text-xl font-bold">${exp.title}</h3><p class="italic">${exp.company} | ${exp.dates}</p><ul class="list-disc pl-5 mt-2">${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul></div>`
      ).join('');

    // Projects
    document.getElementById('projects-list').innerHTML =
      data.projects.map(proj =>
        `<div class="bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-xl font-bold mb-2">${proj.title}</h3><p>${proj.description}</p><div class="mt-2 space-y-1">${proj.links.map(link => `<a href="${link.url}" target="_blank" class="block text-cyan-400 hover:underline"><i class="${link.icon}"></i> ${link.name}</a>`).join('')}</div></div>`
      ).join('');

    // Certifications
    document.getElementById('certifications-list').innerHTML =
      data.certifications.map(cert => {
        const customClass = cert.customClass ? ` ${cert.customClass}` : '';
        if (cert.details) {
          return `<div class="bg-gray-800 p-4 rounded-lg shadow${customClass}"><h3 class="text-xl font-bold mb-2">${cert.name}</h3><ul class="list-disc pl-5">${cert.details.map(d => `<li>${d.name} (${d.issueDate || ''})</li>`).join('')}</ul></div>`;
        } else {
          return `<div class="bg-gray-800 p-4 rounded-lg shadow${customClass}"><h3 class="text-xl font-bold mb-2">${cert.name}</h3><p>${cert.issueDate || ''}</p></div>`;
        }
      }).join('');

    // Education
    document.getElementById('education-list').innerHTML =
      data.education.map(ed =>
        `<div class="bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-xl font-bold mb-2">${ed.degree}</h3><p class="italic">${ed.school}</p><p>${ed.dates}</p></div>`
      ).join('');

    // Blog
    document.getElementById('blog-list').innerHTML =
      data.blog.map(post =>
        `<div class="bg-gray-800 p-4 rounded-lg shadow"><h3 class="text-xl font-bold mb-2">${post.title}</h3><p class="text-sm text-gray-400">${post.date}</p><p class="mt-2">${post.summary}</p><a href="${post.link}" target="_blank" class="text-cyan-400 hover:underline mt-2 inline-block">Read more →</a></div>`
      ).join('');
  });
