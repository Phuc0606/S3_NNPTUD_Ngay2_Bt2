async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';
        for (const post of posts) {
            let isDeleted = post.isDeleted === true;
            let rowStyle = isDeleted ? "style='text-decoration: line-through; color: gray;'" : "";
            let deleteBtn = isDeleted ? '' : `<input type='submit' value='Delete' onclick='Delete(${post.id})'>`;
            body.innerHTML += `<tr ${rowStyle}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${deleteBtn}</td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;
    if (id) {
        //edit
        let res = await fetch('http://localhost:3000/posts/'+id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views
            })
        })
        if (res.ok) {
            console.log("thanh cong");
        }
    } else {
        //create mới, lấy maxId + 1
        let resPosts = await fetch('http://localhost:3000/posts');
        let posts = await resPosts.json();
        let maxId = 0;
        for (const p of posts) {
            let pid = parseInt(p.id);
            if (!isNaN(pid) && pid > maxId) maxId = pid;
        }
        let newId = (maxId + 1).toString();
        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views
            })
        })
        if (res.ok) {
            console.log("thanh cong");
        }
    }
}
async function Delete(id) {
    // Xoá mềm: cập nhật isDeleted:true
    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isDeleted: true })
    })
    if (res.ok) {
        console.log("Xoá mềm thành công");
        getData();
    }
}
getData();

