// load the users in the table
async function loadUsers() {
    const users = await fetch("/users").then((res) => res.json());
    const table = document.getElementById("users");
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", user._id);
      row.innerHTML = `
      <th>${index+1}</th>
      <td>title="${user.username}">${user.username}</td>
      <td>${user.admin ? "Admin" : "Contributor"}</td>
      <td>23</td>
      <td>12</td>
      <td>3</td>
      <td>68</td>
      <td>36</td>
      <td>+32</td>
      <td>81</td>
      <td>Qualification for the <a href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage" title="2016–17 UEFA Champions League">Champions League group stage</a></td>
      `;
      table.appendChild(row);
    });
  }