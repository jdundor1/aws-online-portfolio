document.addEventListener('DOMContentLoaded', () => {
    // Function to populate content from data.json
    const populateContent = () => {
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // S3 Base URL for your assets
                const s3BaseUrl = 'https://jdundor1-portfolio-assets.s3.us-east-1.amazonaws.com/';

                // Populate About section
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const aboutContentDiv = aboutSection.querySelector('.container.mx-auto.px-4.max-w-4xl');
                    if (aboutContentDiv) {
                        const existingParagraphs = aboutContentDiv.querySelectorAll('p:not(.section-title)');
                        existingParagraphs.forEach(p => p.remove());

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
                    skillsContainer.innerHTML = '';
                    data.skills.forEach(skill => {
                        const skillDiv = document.createElement('div');
                        skillDiv.className = 'bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-cyan-500 hover:shadow-xl transition duration-300 flex items-start space-x-4';
                        skillDiv.innerHTML = `
                            <i class="fas fa-cloud text-cyan-400 text-2xl mt-1"></i>
                            <div>
                                <h3 class="font-semibold text-xl mb-2 text-cyan-400">${skill.title}</h3>
                                <p class="text-gray-300">${skill.description}</p>
                            </div>
                        `;
                        skillsContainer.appendChild(skillDiv);
                    });
                }

                // Populate Experience section
                const experienceContainer = document.querySelector('#experience .space-y-8');
                if (experienceContainer) {
                    experienceContainer.innerHTML = '';
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
                    projectsContainer.innerHTML = '';
                    data.projects.forEach(project => {
                        const projectDiv = document.createElement('div');
                        projectDiv.className = 'bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-cyan-500 hover:shadow-xl transition duration-300';

                        let contentHtml = `<p class="text-gray-300">${project.description}</p>`;
                        
                        let projectLinksHtml = '';
                        if (project.links && project.links.length > 0) {
                            projectLinksHtml += '<div class="mt-4 space-y-2 text-sm flex flex-col">';
                            project.links.forEach(link => {
                                let linkUrl = link.url;
                                if (link.url.includes('.pdf') || link.url.includes('.png') || link.url.includes('.jpg')) {
                                  linkUrl = `${s3BaseUrl}${link.url}`;
                                }
                                projectLinksHtml += `<a href="${linkUrl}" target="_blank" class="text-cyan-400 hover:underline flex items-center mb-2"><i class="${link.icon} mr-1"></i>${link.name}</a>`;
                            });
                            projectLinksHtml += '</div>';
                        }
                        
                        projectDiv.innerHTML = `
                            <h3 class="font-semibold text-xl mb-2 text-cyan-400">${project.title}</h3>
                            ${contentHtml}
                            ${projectLinksHtml}
                        `;
                        projectsContainer.appendChild(projectDiv);
                    });
                }

                // Populate Certifications section
                const certificationsContainer = document.querySelector('#certifications .flex.flex-wrap.justify-center.items-center.gap-6');
                if (certificationsContainer) {
                    certificationsContainer.innerHTML = '';
                    data.certifications.forEach(cert => {
                        const certDiv = document.createElement('div');
                        certDiv.className = 'bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center space-x-3';
                        let badgeLinkHtml = '';
                        
                        // Check for consolidated details (e.g., Google Cloud and Project Management)
                        if (cert.details && cert.details.length > 0) {
                            const detailsHtml = cert.details.map(detail => `
                                <div class="flex items-center space-x-2">
                                    <a href="${s3BaseUrl}${detail.badgeFile}" target="_blank">
                                        <img src="${s3BaseUrl}${detail.badgeFile}" alt="${detail.name} Badge" class="w-8 h-8 rounded-full">
                                    </a>
                                    <div>
                                        <p class="text-sm font-semibold text-gray-200">${detail.name}</p>
                                        <p class="text-xs text-gray-400">Issued: ${detail.issueDate}</p>
                                    </div>
                                    ${detail.certificateFile ? `<a href="${s3BaseUrl}${detail.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-xs flex items-center ml-auto"><i class="fas fa-file-pdf"></i></a>` : ''}
                                </div>
                            `).join('');
    
                            certDiv.innerHTML = `
                                <img src="${s3BaseUrl}${cert.badgeFile}" alt="${cert.name} Badge" class="w-12 h-12 rounded-full">
                                <div>
                                    <h3 class="text-xl font-semibold text-cyan-400">${cert.name}</h3>
                                    <p class="text-gray-400">Issued: ${cert.issueDate}</p>
