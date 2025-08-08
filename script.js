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
<h3 class="font-semibold text-xl text-cyan-400">${exp.title}</h3>
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
// Only prepend s3BaseUrl if the URL does not start with http or https
if (link.url && !link.url.startsWith('http')) {
linkUrl = `${s3BaseUrl}${link.url}`;
}
const indentClass = link.icon === 'fab fa-github' ? 'ml-6' : '';
projectLinksHtml += `<a href="${linkUrl}" target="_blank" class="text-cyan-400 hover:underline flex items-center mb-2 ${indentClass}"><i class="${link.icon} mr-1"></i>${link.name}</a>`;
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
const certificationsContainer =
document.querySelector('#certifications .certifications-container') ||
document.querySelector('#certifications .flex.flex-wrap.justify-center.items-center.gap-6');
if (certificationsContainer) {
certificationsContainer.innerHTML = '';
data.certifications.forEach(cert => {
const certDiv = document.createElement('div');
certDiv.className = 'cert-card bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-start space-x-3';

// Add custom class from data.json to force full-width stack when needed
if (cert.customClass) certDiv.classList.add(cert.customClass);

let badgeLinkHtml = '';
if (cert.badgeFile) {
badgeLinkHtml = `<a href="${s3BaseUrl}${cert.badgeFile}" target="_blank" class="text-cyan-400 hover:underline text-sm flex items-center mb-1"><i class="fas fa-award mr-1"></i>View Badge</a>`;
}
if (cert.certificateFile) {
badgeLinkHtml += `<a href="${s3BaseUrl}${cert.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-sm flex items-center"><i class="fas fa-file-pdf mr-1"></i>View Certificate</a>`;
}

// Check for consolidated details (e.g., Google Cloud, Project Management, Codecademy)
if (cert.details && cert.details.length > 0) {
const detailsHtml = cert.details.map(detail => {
const imgHtml = detail.badgeFile
? `<a href="${s3BaseUrl}${detail.certificateFile || '#'}" target="_blank"><img src="${s3BaseUrl}${detail.badgeFile}" alt="${detail.name} Badge" class="w-8 h-8 rounded-full"></a>`
: '';
const issueHtml = detail.issueDate ? `<p class="text-xs text-gray-400">Issued: ${detail.issueDate}</p>` : '';
const certLink = detail.certificateFile
? `<a href="${s3BaseUrl}${detail.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-xs flex items-center ml-auto"><i class="fas fa-file-pdf"></i></a>`
: '';
return `
<div class="flex items-center space-x-2">
${imgHtml}
<div>
<p class="text-sm font-semibold text-gray-200">${detail.name}</p>
${issueHtml}
</div>
${certLink}
</div>
`;
}).join('');

const topImg = cert.badgeFile ? `<img src="${s3BaseUrl}${cert.badgeFile}" alt="${cert.name} Badge" class="w-12 h-12 rounded-full">` : '';
const issueTop = cert.issueDate ? `<p class="text-gray-400">Issued: ${cert.issueDate}</p>` : '';

certDiv.innerHTML = `
${topImg}
<div>
<h3 class="text-xl font-semibold text-cyan-400">${cert.name}</h3>
${issueTop}
<div class="flex flex-col mt-2 space-y-2">
${detailsHtml}
</div>
</div>
`;
} else {
// Standard single certification entry
const topImg = cert.badgeFile ? `<img src="${s3BaseUrl}${cert.badgeFile}" alt="${cert.name} Badge" class="w-12 h-12 rounded-full">` : '';
const issueTop = cert.issueDate ? `<p class="text-gray-400">Issued: ${cert.issueDate}</p>` : '';
const certLink = cert.certificateFile
? `<a href="${s3BaseUrl}${cert.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-sm flex items-center"><i class="fas fa-file-pdf mr-1"></i>View Certificate</a>`
: '';

certDiv.innerHTML = `
${topImg}
<div>
<h3 class="text-xl font-semibold text-cyan-400">${cert.name}</h3>
${issueTop}
<div class="flex flex-col mt-2 space-y-1">
${certLink}
</div>
</div>
`;
}
certificationsContainer.appendChild(certDiv);
});
}

// Populate Education Section
const educationContainer = document.getElementById('education-list');
if (educationContainer) {
educationContainer.innerHTML = '';
data.education.forEach(edu => {
const eduItem = document.createElement('div');
eduItem.className = 'bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300';
eduItem.innerHTML = `
<h3 class="text-xl font-semibold text-cyan-400">${edu.degree}</h3>
<p class="text-lg text-gray-200">${edu.school}</p>
<p class="text-md text-gray-400">${edu.dates}</p>
`;
educationContainer.appendChild(eduItem);
});
}

// ===== New: Populate Blog Section =====
const blogContainer = document.getElementById('blog-list');
if (blogContainer && data.blog && data.blog.length > 0) {
blogContainer.innerHTML = '';
data.blog.forEach(post => {
const imgSrc = post.image
? (post.image.startsWith('http') ? post.image : `${s3BaseUrl}${post.image}`)
: null;

let linksHtml = '';
if (post.links && post.links.length > 0) {
linksHtml = '<div class="mt-3 space-y-1">';
post.links.forEach(link => {
const url = link.url && !link.url.startsWith('http') ? `${s3BaseUrl}${link.url}` : link.url;
linksHtml += `<a href="${url}" target="_blank" class="text-cyan-400 hover:underline flex items-center text-sm"><i class="${link.icon} mr-2"></i>${link.name}</a>`;
});
linksHtml += '</div>';
}

const card = document.createElement('div');
card.className = 'bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden';
card.innerHTML = `
${imgSrc ? `<img src="${imgSrc}" alt="${post.title}" class="w-full h-40 object-cover">` : ''}
<div class="p-4">
  <h3 class="text-xl font-bold text-cyan-400">${post.title}</h3>
  <p class="text-sm text-gray-400">${post.date}</p>
  <p class="mt-2 text-gray-200">${post.content}</p>
  ${linksHtml}
</div>
`;
blogContainer.appendChild(card);
});
}

// Add Resume Link to Hero Section Button
const heroResumeLink = document.getElementById('heroResumeLink');
if (heroResumeLink && data.resumeFile) {
heroResumeLink.href = `${s3BaseUrl}${data.resumeFile}`;
heroResumeLink.classList.remove('hidden');
}

// Populate Contact information (if you ever add a mailto link element)
const emailLink = document.querySelector('#contact a[href^="mailto:"]');
if (emailLink && data.contact && data.contact.email) {
emailLink.href = `mailto:${data.contact.email}`;
}
const linkedinLink = document.querySelector('#contact a[href*="linkedin.com"]');
if (linkedinLink && data.contact && data.contact.linkedin) {
linkedinLink.href = data.contact.linkedin;
linkedinLink.innerHTML = `<i class="fab fa-linkedin mr-2"></i>Connect on LinkedIn`;
}
})
.catch(error => console.error('Error fetching data:', error));
};

populateContent();

// === Contact Form Submission Logic ===
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const API_GATEWAY_URL = 'https://w1hw5b9b4g.execute-api.us-east-1.amazonaws.com/prod/contact';

if (contactForm) {
contactForm.addEventListener('submit', async (event) => {
event.preventDefault();
formStatus.classList.remove('hidden', 'text-green-500', 'text-red-500');
formStatus.classList.add('text-gray-400');
formStatus.textContent = 'Sending message...';

const formData = new FormData(contactForm);
const payload = {};
for (const [key, value] of formData.entries()) {
payload[key] = value;
}

try {
const response = await fetch(API_GATEWAY_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(payload),
});

const data = await response.json();

if (response.ok) {
formStatus.textContent = data.message || 'Message sent successfully!';
formStatus.classList.remove('text-gray-400');
formStatus.classList.add('text-green-500');
contactForm.reset();
} else {
formStatus.textContent = data.message || 'Failed to send message. Please try again.';
formStatus.classList.remove('text-gray-400');
formStatus.classList.add('text-red-500');
console.error('API Error:', data);
}
} catch (error) {
formStatus.textContent = 'An error occurred. Check your connection or console.';
formStatus.classList.remove('text-gray-400');
formStatus.classList.add('text-red-500');
console.error('Fetch Error:', error);
}
formStatus.classList.remove('hidden');
});
}
});
