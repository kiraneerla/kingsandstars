// Sample movie reviews with OTT platforms
const sampleReviews = [
  {
    movie: "Salaar",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
    rating: 4.5,
    genre: "Action/Thriller",
    cast: "Prabhas, Prithviraj Sukumaran, Shruti Haasan",
    ott: "Netflix",
    review: "Salaar is a high-octane action thriller that showcases Prabhas in his best form. Director Prashanth Neel delivers a gripping narrative filled with intense action sequences and powerful dialogues. The cinematography is top-notch, and the background score elevates every scene. A must-watch for action lovers!"
  },
  {
    movie: "HanuMan",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500",
    rating: 4,
    genre: "Superhero/Fantasy",
    cast: "Teja Sajja, Amritha Aiyer, Varalaxmi Sarathkumar",
    ott: "Zee5",
    review: "HanuMan is India's first original superhero film that brings a fresh concept to Telugu cinema. The VFX work is impressive, especially considering the budget. Teja Sajja delivers a stellar performance, and the emotional core of the story resonates well with the audience. A game-changer for Indian superhero genre!"
  },
  {
    movie: "Hi Nanna",
    poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=500",
    rating: 4.5,
    genre: "Drama/Romance",
    cast: "Nani, Mrunal Thakur, Kiara Khanna",
    ott: "Netflix",
    review: "Hi Nanna is a heartwarming tale of a father-daughter relationship. Nani's emotional performance will leave you in tears. The chemistry between the lead actors is beautiful, and the music by Hesham Abdul Wahab is soul-stirring. A perfect blend of emotions, romance, and family values. Highly recommended for family viewing!"
  }
];

// Elements
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const closeAdmin = document.getElementById('closeAdmin');
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const adminPassword = document.getElementById('adminPassword');
const adminForm = document.getElementById('adminForm');
const reviewsGrid = document.getElementById('reviewsGrid');
const adminReviewsList = document.getElementById('adminReviewsList');

const ADMIN_PASSWORD = 'admin123';

// Load reviews
let reviews = JSON.parse(localStorage.getItem('kingsStarsReviews')) || sampleReviews;
let currentFilter = 'all';

// Generate stars
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '⭐';
  if (hasHalfStar) stars += '🌟';
  return stars + ` ${rating}/5`;
}

// Render public reviews
function renderPublicReviews(filter = 'all') {
  reviewsGrid.innerHTML = '';
  
  const filtered = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.ott && r.ott.toLowerCase() === filter.toLowerCase());
  
  if (filtered.length === 0) {
    reviewsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e94560; font-size: 1.2rem;">No reviews found for this OTT platform.</p>';
    return;
  }
  
  filtered.forEach((review, index) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <img src="${review.poster}" alt="${review.movie}">
      <div class="review-content">
        <h3>${review.movie}</h3>
        <div class="rating">${generateStars(review.rating)}</div>
        <span class="genre">${review.genre}</span>
        ${review.ott ? `<div class="ott-badge">${review.ott}</div>` : ''}
        <p class="cast"><strong>Cast:</strong> ${review.cast}</p>
        <p class="review-text">${review.review}</p>
      </div>
    `;
    reviewsGrid.appendChild(card);
  });
}

// OTT Filter buttons
document.querySelectorAll('.logo-item').forEach(btn => {
  btn.addEventListener('click', function() {
    const platform = this.textContent.trim();
    currentFilter = platform;
    
    // Remove active class from all
    document.querySelectorAll('.logo-item').forEach(b => b.classList.remove('active'));
    // Add active to clicked
    this.classList.add('active');
    
    renderPublicReviews(platform);
  });
});

// Render admin reviews
function renderAdminReviews() {
  if (reviews.length === 0) {
    adminReviewsList.innerHTML = '<p style="color: #fff;">No reviews yet.</p>';
    return;
  }
  
  adminReviewsList.innerHTML = '';
  reviews.forEach((review, index) => {
    const item = document.createElement('div');
    item.style.cssText = 'background: rgba(255,255,255,0.2); padding: 1rem; margin-bottom: 1rem; border-radius: 10px;';
    item.innerHTML = `
      <h4 style="color: #fff; margin-bottom: 0.5rem;">${review.movie} ${generateStars(review.rating)} ${review.ott ? `[${review.ott}]` : ''}</h4>
      <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">${review.review.substring(0, 100)}...</p>
      <button onclick="deleteReview(${index})" style="background: #f5576c; color: #fff; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 0.5rem;">Delete</button>
    `;
    adminReviewsList.appendChild(item);
  });
}

// Delete review
function deleteReview(index) {
  if (confirm('Delete this review?')) {
    reviews.splice(index, 1);
    localStorage.setItem('kingsStarsReviews', JSON.stringify(reviews));
    renderPublicReviews(currentFilter);
    renderAdminReviews();
  }
}
window.deleteReview = deleteReview;

// Admin panel
adminBtn.addEventListener('click', () => adminPanel.classList.remove('hidden'));
closeAdmin.addEventListener('click', () => adminPanel.classList.add('hidden'));

// Login
loginBtn.addEventListener('click', () => {
  if (adminPassword.value === ADMIN_PASSWORD) {
    loginForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    renderAdminReviews();
    adminPassword.value = '';
  } else {
    alert('❌ Wrong password!');
  }
});

adminPassword.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') loginBtn.click();
});

// Submit review
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newReview = {
    movie: document.getElementById('adminMovieName').value.trim(),
    poster: document.getElementById('adminMoviePoster').value.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
    rating: parseFloat(document.getElementById('adminRating').value),
    genre: document.getElementById('adminGenre').value.trim(),
    cast: document.getElementById('adminCast').value.trim(),
    ott: document.getElementById('adminOTT').value.trim(),
    review: document.getElementById('adminReview').value.trim(),
    date: new Date().toISOString()
  };
  
  reviews.unshift(newReview);
  localStorage.setItem('kingsStarsReviews', JSON.stringify(reviews));
  renderPublicReviews(currentFilter);
  renderAdminReviews();
  adminForm.reset();
  alert('✅ Review published!');
});

// Initial render
renderPublicReviews();