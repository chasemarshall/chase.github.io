const posts = [
  {
    title: 'Building a Password Manager',
    content: 'A lightweight CLI tool to securely store, generate, and retrieve passwords. In this post I break down the core features, including encryption strategy, database design, and how to keep secrets safe.',
    categories: ['security', 'python']
  },
  {
    title: 'Crafting My Terminal Setup',
    content: 'An overview of my dotfile collection and the philosophy behind a productive terminal environment. I cover plugins, themes, and the little tweaks that make command-line work enjoyable.',
    categories: ['workflow', 'tools']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blogContainer');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  const allCategories = Array.from(new Set(posts.flatMap(p => p.categories)));
  categoryFilter.innerHTML = '<option value="all">all</option>' +
    allCategories.map(c => `<option value="${c}">${c}</option>`).join('');

  function render(list) {
    container.innerHTML = '';
    list.forEach(post => {
      const tile = document.createElement('div');
      tile.className = 'post-tile';
      const preview = post.content.slice(0, 50) + (post.content.length > 50 ? '…' : '');
      tile.innerHTML = `<h3>${post.title}</h3><p class="preview">${preview}</p><p class="categories">${post.categories.join(' • ')}</p>`;
      tile.addEventListener('click', () => openModal(post));
      container.appendChild(tile);
    });
  }

  function filterPosts() {
    const query = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const filtered = posts.filter(post => {
      const inCategory = category === 'all' || post.categories.includes(category);
      const inSearch = post.title.toLowerCase().includes(query) ||
                       post.content.toLowerCase().includes(query);
      return inCategory && inSearch;
    });
    render(filtered);
  }

  searchInput.addEventListener('input', filterPosts);
  categoryFilter.addEventListener('change', filterPosts);

  render(posts);
});

function openModal(post) {
  const modal = document.getElementById('postModal');
  document.getElementById('modalTitle').textContent = post.title;
  document.getElementById('modalBody').textContent = post.content;
  modal.style.display = 'block';
}

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('postModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('postModal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
