document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Populate About section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const aboutContentDiv = aboutSection.querySelector('.container.mx-auto.px-4.max-w-4xl');
                if (aboutContentDiv) {
                    // Clear existing content except title
                    const existingParagraphs = aboutContentDiv.querySelectorAll('p:not(.section-title)');
                    existingParagraphs.forEach(p => p.remove());

                    // Add new paragraphs from data
                    data.about.paragraphs.forEach(paragraphText => {
                        const p = document.createElement('p');
                        p.className = 'text-lg leading-relaxed mb-4';
                        p.textContent = paragraphText;
                        aboutContentDiv.appendChild(p);
                    });
                }
            }


            // Populate Skills section
            const skillsContainer = document.querySelector('#skills .grid');
            if (skillsContainer) {
                skillsContainer.innerHTML = ''; // Clear existing skills
                data.skills.forEach(skill => {
                    const skillDiv = document.createElement('div');
                    skillDiv.className = 'bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-cyan-500 hover:shadow-xl transition duration-300';
                    skillDiv.innerHTML = `
                        <h3 class="font-semibold text-xl mb-2 text-cyan-400">${skill.title}</h3>
                        <p class="text-gray-300">${skill.description}</p>
                    `;
                    skillsContainer.appendChild(skillDiv);
                });
            }

            // Populate Experience section
            const experienceContainer = document.querySelector('#experience .space-y-8');
            if (experienceContainer) {
                experienceContainer.innerHTML = ''; // Clear existing experience
                data.experience.forEach(exp => {
                    const expDiv = document.createElement('div');
                    expDiv.className = 'bg-gray-950 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300';
                    const responsibilitiesHtml = exp.responsibilities.map(resp => `<li>${resp}</li>`).join('');
                    expDiv.innerHTML = `
                        <h3 class="text-xl font-semibold text-cyan-400">${exp.title}</h3>
                        <p class="text-lg text-gray-200">${exp.company}</p>
                        <p class="text-md text-gray-400 mb-4">${exp.dates}</p>
                        <ul class="list-disc list-inside text-gray-200 space-y-2">
                            ${responsibilitiesHtml}
                        </ul>
                    `;
                    experienceContainer.appendChild(expDiv);
                });
            }

            // Populate Projects section
            const projectsContainer = document.querySelector('#projects .grid');
            if (projectsContainer) {
                projectsContainer.innerHTML = ''; // Clear existing projects
                data.projects.forEach(project => {
                    const projectDiv = document.createElement('div');
                    projectDiv.className = 'bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-cyan-500 hover:shadow-xl transition duration-300';

                    let contentHtml = '';
                    if (project.items) {
                        const itemsHtml = project.items.map(item => `<li>${item}</li>`).join('');
                        contentHtml = `<ul class="list-disc list-inside text-gray-200 space-y-1">${itemsHtml}</ul>`;
                    } else if (project.description) {
                        contentHtml = `<p class="text-gray-300">${project.description}</p>`;
                    }

                    projectDiv.innerHTML = `
                        <h3 class="font-semibold text-xl mb-2 text-cyan-400">${project.title}</h3>
                        ${contentHtml}
                    `;
                    projectsContainer.appendChild(projectDiv);
                });
            }

            // Populate Contact information (email and LinkedIn URL in links)
            const emailLink = document.querySelector('#contact a[href^="mailto:"]');
            if (emailLink) {
                emailLink.href = `mailto:${data.contact.email}`;
            }
            const linkedinLink = document.querySelector('#contact a[href*="linkedin.com"]');
            if (linkedinLink) {
                linkedinLink.href = data.contact.linkedin;
            }

        })
        .catch(error => console.error('Error fetching data:', error));
});