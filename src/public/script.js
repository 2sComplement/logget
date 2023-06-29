
let state = {
    fileContents: [],
    pageSize: 1000,
    isLoading: false
}

function createLink(name, onclick) {
    let a = document.createElement("a");
    a.href = "#";
    a.onclick = onclick;
    a.appendChild(document.createTextNode(name));
    return a;
}

function wrapInDiv(element) {
    let div = document.createElement("div");
    div.appendChild(element);
    return div;
}

function updateFileExplorer(path, dirContents) {
    document.getElementById("explorer").innerHTML = "";
    document.getElementById("currentPath").innerHTML = dirContents.path;

    if (path && path != "") {
        const dirStack = path.split("/");
        dirStack.pop();
        let upOne = dirStack.join("/");
        let onclick = function () {
            listDirectory(upOne);
        };

        document.getElementById("explorer").appendChild(wrapInDiv(createLink(`🗀 ..`, onclick)));
    }

    const dirs = dirContents.dirs;

    for (let i = 0; i < dirs.length; i++) {
        let onclick = function () {
            listDirectory(`${path}/${dirs[i].name}`);
        };
        document.getElementById("explorer").appendChild(wrapInDiv(createLink(`🗀 ${dirs[i].name}`, onclick)));
    }

    const files = dirContents.files;
    for (let i = 0; i < files.length; i++) {
        let onclick = function () {
            getFileContents(`${path}/${files[i].name}`);
        };
        document
            .getElementById("explorer")
            .appendChild(wrapInDiv(createLink(`🗎 ${files[i].name} (${files[i].size})`, onclick)));
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clearFileContentsText() {
    document.getElementById("fileContentsText").textContent = "";
    document.getElementById("prevPage").textContent = "";
    document.getElementById("nextPage").textContent = "";
    document.getElementById("currPage").innerHTML = "";
    document.getElementById("fileName").innerHTML = "";
}

function updatePagination(page) {
    
    // Clear page links
    document.getElementById("prevPage").textContent = "";
    document.getElementById("nextPage").textContent = "";

    // No pagination required
    if (page == null || page == undefined) {
        document.getElementById("currPage").innerHTML = "Page 1/1";
        return;
    }

    const start = state.pageSize * page;
    const pages = Math.ceil(state.fileContents.length / state.pageSize);

    if (page > 0) {
        let onclick = function () {
            updatePagination(page - 1)
        }
        let prev = createLink(`Page ${page}`, onclick)
        document.getElementById("prevPage").appendChild(prev);
    }

    if (page < pages - 1) {
        let onclick = function () {
            updatePagination(page + 1)
        }
        let next = createLink(`Page ${page + 2}`, onclick)
        document.getElementById("nextPage").appendChild(next);
    }

    document.getElementById("currPage").innerHTML = `Page ${page + 1}/${pages}`;
    document.getElementById("fileContentsText").textContent = state.fileContents.slice(start, start + state.pageSize).join('\n');
}

function getQueryParams() {
    let queryParams = [];

    const search = document.getElementById("search").value;
    const last = document.getElementById("last").value;

    if (search !== "") {
        queryParams.push(`search=${search}`);
    }
    if (last !== "") {
        queryParams.push(`last=${last}`);
    }

    if (queryParams.length > 0) {
        return `?${queryParams.join("&")}`
    } else {
        return "";
    }
}

function getFileContents(path) {
    if (!path || path === "") return;
    
    state.fileContents = [];
    document.getElementById("fileContentsText").textContent = "Loading";
    document.getElementById("fileName").textContent = path;

    const xhttp = new XMLHttpRequest();
    const encoded = encodeURI(path);

    let queryParams = getQueryParams();

    xhttp.open("GET", `http://localhost:3100/logs/${encoded}${queryParams}`, true);
    xhttp.send();
    xhttp.onload = function () {
        let resp = xhttp.responseText;

        let respLines = resp.split('\n');

        if (respLines.length > state.pageSize) {
            state.fileContents = respLines;
            updatePagination(0);
        } else {
            updatePagination();
            document.getElementById("fileContentsText").textContent = resp;
        }
    };
}

function listDirectory(path) {
    const xhttp = new XMLHttpRequest();

    // Reset the error
    document.getElementById("error").innerHTML = "";

    // Make the request
    const encoded = path ?? encodeURI(path);
    xhttp.open("GET", `http://localhost:3100/logs/${encoded}`, true);
    xhttp.onerror = function (err) {
        console.log("ERROR");
        alert("Error: " + err);
    };
    xhttp.onload = function () {
        console.log(xhttp.status);
        if (xhttp.status === 200) {
            let resp = JSON.parse(xhttp.responseText);
            updateFileExplorer(path, resp);
        } else {
            document.getElementById("error").innerHTML = xhttp.responseText;
        }
    };
    xhttp.send();
}
