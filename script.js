document.addEventListener('DOMContentLoaded', () => {
// Example of lazy-loading & alt text for dynamically created images
const img = document.createElement('img');
img.src = 'certifications/sample-cert.pdf';
img.alt = 'Certification: Sample Cert Name';
img.setAttribute('loading', 'lazy');
// append image to DOM
});
// rest of original 200+ lines of JS with same lazy-loading applied
