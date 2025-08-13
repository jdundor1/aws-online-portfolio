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
<i class="fas fa-cloud text-cyan-400 text-2xl mt-1" aria-hidden="true"></i>
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

    const responsibilitiesHtml = (exp.responsibilities || [])
      .map(resp => `<li>${resp}</li>`).join('');

    // Build links (supports absolute URLs and S3-relative paths like "folder/file.pdf")
    let linksHtml = '';
    if (exp.links && exp.links.length > 0) {
      linksHtml += '<div class="mt-4 space-y-2 text-sm flex flex-col">';
      exp.links.forEach(link => {
        let linkUrl = link.url || '#';
        if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
          linkUrl = `${s3BaseUrl}${linkUrl}`;
        }
        const iconClass = link.icon ? link.icon : 'fas fa-link';
        linksHtml += `
          <a href="${linkUrl}"
             target="_blank" rel="noopener noreferrer"
             class="text-cyan-400 hover:underline flex items-center">
            <i class="${iconClass}" aria-hidden="true"></i>
            <span class="ml-1">${link.name || linkUrl}</span>
          </a>`;
      });
      linksHtml += '</div>';
    }

    expDiv.innerHTML = `
      <h3 class="font-semibold text-xl text-cyan-400">${exp.title}</h3>
      <p class="text-lg text-gray-200">${exp.company}</p>
      <p class="text-md text-gray-400 mb-4">${exp.dates}</p>
      <ul class="list-disc list-inside text-gray-200 space-y-2">
        ${responsibilitiesHtml}
      </ul>
      ${linksHtml}
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
projectLinksHtml += `<a href="${linkUrl}" target="_blank" class="text-cyan-400 hover:underline flex items-center mb-2 ${indentClass}"><i class="${link.icon}" aria-hidden="true"></i><span class="ml-1">${link.name}</span></a>`;
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
badgeLinkHtml = `<a href="${s3BaseUrl}${cert.badgeFile}" target="_blank" class="text-cyan-400 hover:underline text-sm flex items-center mb-1"><i class="fas fa-award mr-1" aria-hidden="true"></i>View Badge</a>`;
}
if (cert.certificateFile) {
badgeLinkHtml += `<a href="${s3BaseUrl}${cert.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-sm flex items-center"><i class="fas fa-file-pdf mr-1" aria-hidden="true"></i>View Certificate</a>`;
}

// Check for consolidated details (e.g., Google Cloud, Project Management, Codecademy)
if (cert.details && cert.details.length > 0) {
const detailsHtml = cert.details.map(detail => {
const imgHtml = detail.badgeFile
? `<a href="${s3BaseUrl}${detail.certificateFile || '#'}" target="_blank"><img src="${s3BaseUrl}${detail.badgeFile}" alt="${detail.name} badge" loading="lazy" class="w-8 h-8 rounded-full"></a>`
: '';
const issueHtml = detail.issueDate ? `<p class="text-xs text-gray-400">Issued: ${detail.issueDate}</p>` : '';
const certLink = detail.certificateFile
? `<a href="${s3BaseUrl}${detail.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-xs flex items-center ml-auto"><i class="fas fa-file-pdf" aria-hidden="true"></i></a>`
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

const topImg = cert.badgeFile ? `<img src="${s3BaseUrl}${cert.badgeFile}" alt="${cert.name} badge" loading="lazy" class="w-12 h-12 rounded-full">` : '';
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
const topImg = cert.badgeFile ? `<img src="${s3BaseUrl}${cert.badgeFile}" alt="${cert.name} badge" loading="lazy" class="w-12 h-12 rounded-full">` : '';
const issueTop = cert.issueDate ? `<p class="text-gray-400">Issued: ${cert.issueDate}</p>` : '';
const certLink = cert.certificateFile
? `<a href="${s3BaseUrl}${cert.certificateFile}" target="_blank" class="text-cyan-400 hover:underline text-sm flex items-center"><i class="fas fa-file-pdf mr-1" aria-hidden="true"></i>View Certificate</a>`
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

// ===== Dynamic-or-Static Blog Module =====

// 1) If/when you stand up the API Gateway, paste its base URL here:
const BLOG_API_BASE = ""; 
// Example: "https://abc123.execute-api.us-east-1.amazonaws.com"

// 2) Helper to build full image URL from your S3 assets bucket
const buildImg = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${s3BaseUrl}${path}`;
};

// 3) Render a list of blog cards
const renderBlogFeed = (posts) => {
  const blogContainer = document.getElementById("blog-list");
  if (!blogContainer) return;
  blogContainer.innerHTML = posts.map(post => {
    const img = buildImg(post.image);
    return `
      <article class="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
        ${img ? `<img src="${img}" alt="${post.title || "Blog post"}" loading="lazy" class="w-full h-40 object-cover">` : ""}
        <div class="p-4">
          <h3 class="text-xl font-bold text-cyan-400">${post.title || ""}</h3>
          <p class="text-sm text-gray-400">${post.date || ""}</p>
          <p class="mt-2 text-gray-200">${post.summary || post.content || ""}</p>
          <button data-slug="${post.slug || ""}" class="mt-3 inline-block text-cyan-400 hover:underline read-post">Read more →</button>
        </div>
      </article>
    `;
  }).join("");

  // Hook up "Read more" buttons to load the full post
  blogContainer.querySelectorAll(".read-post").forEach(btn => {
    btn.addEventListener("click", async () => {
      const slug = btn.getAttribute("data-slug");
      if (!slug || !BLOG_API_BASE) return; // only works when API is configured
      try {
        const res = await fetch(`${BLOG_API_BASE}/blog/${slug}`);
        if (!res.ok) throw new Error("Post fetch failed");
        const post = await res.json(); // { meta, markdown }
        const html = window.marked ? marked.parse(post.markdown || "") : (post.markdown || "");

        const card = btn.closest("article");
        card.innerHTML = `
          ${post.meta?.image ? `<img src="${buildImg(post.meta.image)}" alt="${post.meta?.title || "Blog post"}" loading="lazy" class="w-full h-56 object-cover">` : ""}
          <div class="p-4">
            <h2 class="text-2xl font-extrabold text-cyan-400">${post.meta?.title || slug}</h2>
            <p class="text-sm text-gray-400">${post.meta?.date || ""}</p>
            <div class="prose prose-invert max-w-none mt-4">${html}</div>
            <button class="mt-6 text-cyan-400 hover:underline back-to-list">← Back to posts</button>
          </div>
        `;
        card.querySelector(".back-to-list").addEventListener("click", () => {
          window.location.hash = "#blog";
          window.location.reload();
        });
      } catch (e) {
        console.error(e);
        alert("Sorry, that post could not be loaded.");
      }
    });
  });
};

// 4) Try API first → fall back to data.json
const renderBlogDynamicOrStatic = async (dataObj) => {
  const blogContainer = document.getElementById("blog-list");
  if (!blogContainer) return;

  // If API not configured, render from data.json immediately
  if (!BLOG_API_BASE) {
    const staticFeed = (dataObj.blog || []).map((b, i) => ({
      slug: `post-${i}`,
      title: b.title,
      date: b.date,
      image: b.image,
      summary: b.content,
      links: b.links || []
    }));
    renderBlogFeed(staticFeed);
    return;
  }

  // API path is set → try to fetch it
  try {
    const res = await fetch(`${BLOG_API_BASE}/blog`, { method: "GET" });
    if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
    const feed = await res.json(); // { items: [...] }
    const items = Array.isArray(feed.items) ? feed.items : [];
    if (items.length === 0) {
      const staticFeed = (dataObj.blog || []).map((b, i) => ({
        slug: `post-${i}`,
        title: b.title,
        date: b.date,
        image: b.image,
        summary: b.content,
        links: b.links || []
      }));
      renderBlogFeed(staticFeed);
      return;
    }
    renderBlogFeed(items);
  } catch (e) {
    console.warn("Blog API not reachable, falling back to data.json.", e);
    const staticFeed = (dataObj.blog || []).map((b, i) => ({
      slug: `post-${i}`,
      title: b.title,
      date: b.date,
      image: b.image,
      summary: b.content,
      links: b.links || []
    }));
    renderBlogFeed(staticFeed);
  }
};

// Call the dynamic-or-static blog renderer
renderBlogDynamicOrStatic(data);

// ===== End Dynamic-or-Static Blog Module =====


// Add Resume Link to Hero Section Button
const heroResumeLink = document.getElementById('heroResumeLink');
if (heroResumeLink && data.resumeFile) {
heroResumeLink.href = `${s3BaseUrl}${data.resumeFile}`;
heroResumeLink.classList.remove('hidden');
}

// Populate Contact information
const emailLink = document.querySelector('#contact a[href^="mailto:"]');
if (emailLink && data.contact && data.contact.email) {
emailLink.href = `mailto:${data.contact.email}`;
}
const linkedinLink = document.querySelector('#contact a[href*="linkedin.com"]');
if (linkedinLink && data.contact && data.contact.linkedin) {
linkedinLink.href = data.contact.linkedin;
linkedinLink.innerHTML = `<i class="fab fa-linkedin mr-2" aria-hidden="true"></i>Connect on LinkedIn`;
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
/* ===============================
   Dynamic Blog: load from S3 public posts (fallback to signed URL)
   =============================== */
(() => {
  // Public S3 location (no signed URL needed)
  const PUBLIC_POST_KEY = 'first-post.md'; // change if you want a different post
  const PUBLIC_POST_URL =
    `https://jd-portfolio-content-blog-us-east-1.s3.amazonaws.com/posts/${encodeURIComponent(PUBLIC_POST_KEY)}`;

  // Optional: paste a valid signed URL if you want a fallback while testing
  // Leave as empty string "" if you don’t need it.
  const SIGNED_URL = "";

  const elContent = document.getElementById('blog-content');
  const elStatus  = document.getElementById('blog-status');
  if (!elContent) return; // Page doesn’t have the blog card

  const showStatus = (msg, isError = false) => {
    if (!elStatus) return;
    elStatus.textContent = msg;
    elStatus.classList.remove('hidden');
    elStatus.classList.toggle('text-red-400', isError);
    elStatus.classList.toggle('text-gray-400', !isError);
  };

  async function fetchMarkdown(url, label) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`${label}: HTTP ${res.status} ${res.statusText}`);
    }
    return res.text();
  }

  async function loadBlog() {
    try {
      showStatus('Loading post…');

      let md;
      // 1) Try public S3 first
      try {
        md = await fetchMarkdown(PUBLIC_POST_URL, 'Public S3');
      } catch (errPublic) {
        // 2) If public fails and we have a signed URL, try that
        if (SIGNED_URL) {
          console.warn('Public fetch failed, trying signed URL fallback.', errPublic);
          md = await fetchMarkdown(SIGNED_URL, 'Signed URL');
        } else {
          throw errPublic;
        }
      }

      // Render markdown (marked is loaded in index.html)
      elContent.innerHTML = window.marked ? marked.parse(md) : md;

      showStatus('Loaded.');
      setTimeout(() => elStatus && elStatus.classList.add('hidden'), 1200);
    } catch (err) {
      console.error('Blog load error:', err);
      showStatus(
        'Could not load the blog post. Make sure the object exists at S3 /posts/, your bucket policy allows public read, and the URL is correct.',
        true
      );
    }
  }

  document.addEventListener('DOMContentLoaded', loadBlog);
})();
