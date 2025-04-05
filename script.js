const API = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (!user) return;
  main.innerHTML = `<div class="loader"></div>`;
  try {
    const { data } = await axios(API + user);
    const { data: repos } = await axios(`${API}${user}/repos?sort=created`);
    renderUser(data);
    renderRepos(repos);
  } catch {
    showToast('User not found or error fetching data.');
    main.innerHTML = `<div class="card"><h1>User not found</h1></div>`;
  }
  search.value = '';
});

function renderUser(user) {
  main.innerHTML = `
    <div class="card">
      <div><img src="${user.avatar_url}" alt="${user.login}" class="avatar"></div>
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        ${user.bio ? `<p>${user.bio}</p>` : ''}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>`;
}

function renderRepos(repos) {
  const reposEl = document.getElementById('repos');
  repos.slice(0, 5).forEach(repo => {
    const a = document.createElement('a');
    a.className = 'repo';
    a.href = repo.html_url;
    a.target = '_blank';
    a.textContent = repo.name;
    reposEl.appendChild(a);
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
