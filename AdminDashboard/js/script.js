
document.addEventListener('DOMContentLoaded', function () {
    let users = []; 
    let currentPage = 1;
    const rowsPerPage = 10;
    const userTableBody = document.querySelector('#user-table tbody');
    const searchBox = document.getElementById('search-box');
    const selectAllCheckbox = document.getElementById('select-all');
    const deleteSelectedButton = document.getElementById('delete-selected');
    const paginationDiv = document.getElementById('pagination');

  
    async function fetchData() {
        try {
            const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
            users = await response.json();
            displayUsers(users, currentPage);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

   
    function displayUsers(userList, page) {
        userTableBody.innerHTML = ''; 

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const usersToShow = userList.slice(start, end);

        usersToShow.forEach(user => {
            const row = userTableBody.insertRow();
            row.innerHTML = `
                <td><input type="checkbox" class="select-row"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit" onclick="editUser('${user.id}', this)">Edit</button>
                    <button class="delete" onclick="deleteUser('${user.id}', this)">Delete</button>
                </td>
            `;
        });

      
        updatePagination(userList.length, page);
    }

   
    searchBox.addEventListener('input', (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => {
            return (
                user.name.toLowerCase().includes(searchQuery) ||
                user.email.toLowerCase().includes(searchQuery) ||
                user.role.toLowerCase().includes(searchQuery)
            );
        });
        displayUsers(filteredUsers, 1);
    });

   
    function updatePagination(totalUsers, currentPage) {
        paginationDiv.innerHTML = ''; 

        
        const pageCount = Math.ceil(totalUsers / rowsPerPage);

      
        const firstPageBtn = document.createElement('button');
        firstPageBtn.textContent = 'First';
        firstPageBtn.onclick = () => displayUsers(users, 1);
        paginationDiv.appendChild(firstPageBtn);

        
        const prevPageBtn = document.createElement('button');
        prevPageBtn.textContent = 'Previous';
        prevPageBtn.onclick = () => {
            if (currentPage > 1) displayUsers(users, currentPage - 1);
        };
        paginationDiv.appendChild(prevPageBtn);

       
        for (let i = 1; i <= pageCount; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.onclick = () => displayUsers(users, i);
            if (currentPage === i) pageBtn.classList.add('current');
            paginationDiv.appendChild(pageBtn);
        }

        
        const nextPageBtn = document.createElement('button');
        nextPageBtn.textContent = 'Next';
        nextPageBtn.onclick = () => {
            if (currentPage < pageCount) displayUsers(users, currentPage + 1);
        };
        paginationDiv.appendChild(nextPageBtn);

        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.textContent = 'Last';
        lastPageBtn.onclick = () => displayUsers(users, pageCount);
        paginationDiv.appendChild(lastPageBtn);
    }

   
    window.editUser = function (userId, btn) {
        
    };

  
    window.deleteUser = function (userId, btn) {
        
        users = users.filter(user => user.id !== userId);
        displayUsers(users, currentPage);
    };

    
    selectAllCheckbox.addEventListener('change', function () {
        const checkboxes = userTableBody.querySelectorAll('.select-row');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    
    deleteSelectedButton.addEventListener('click', function () {
        const selectedCheckboxes = userTableBody.querySelectorAll('.select-row:checked');
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const userId = row.querySelector('.delete').onclick.toString().match(/'(\d+)'/)[1];
            users = users.filter(user => user.id !== userId);
        });
        displayUsers(users, currentPage);
    });

    document.getElementById('add-user-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const newName = document.getElementById('new-user-name').value;
        const newEmail = document.getElementById('new-user-email').value;
        const newRole = document.getElementById('new-user-role').value;
        const newId = String(Math.max(...users.map(u => parseInt(u.id))) + 1); 
    
        const newUser = { id: newId, name: newName, email: newEmail, role: newRole };
        users.push(newUser);
        displayUsers(users, currentPage);
    
        
        document.getElementById('new-user-name').value = '';
        document.getElementById('new-user-email').value = '';
        document.getElementById('new-user-role').value = '';
    });
    
   
    window.editUser = function (userId, btn) {
        const row = btn.closest('tr');
        const cells = row.getElementsByTagName('td');
        if (btn.textContent === 'Edit') {
            
            cells[1].innerHTML = `<input type="text" value="${cells[1].textContent}" class="edit-name">`;
            cells[2].innerHTML = `<input type="email" value="${cells[2].textContent}" class="edit-email">`;
            cells[3].innerHTML = `<input type="text" value="${cells[3].textContent}" class="edit-role">`;
            btn.textContent = 'Save';
        } else {
           
            const newName = row.querySelector('.edit-name').value;
            const newEmail = row.querySelector('.edit-email').value;
            const newRole = row.querySelector('.edit-role').value;
    
            
            const userIndex = users.findIndex(user => user.id === userId);
            users[userIndex].name = newName;
            users[userIndex].email = newEmail;
            users[userIndex].role = newRole;
    
           
            displayUsers(users, currentPage);
        }
    };

    fetchData();
});
